import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as t,c as o,e as n}from"./app-DWz5k_-z.js";const l={},a=n(`<h2 id="aof日志" tabindex="-1"><a class="header-anchor" href="#aof日志"><span>AOF日志</span></a></h2><p>如果每执行一个写操作命令，就把该命令追加写入到一个文件，在重启Redis的时候读取文件中的命令并去执行它，就相当于恢复缓存数据了。这种保存写操作命令到日志的持久化方式就是AOF（Append Only File）持久化功能，<strong>注意只会记录写操作命令，读操作命令是不会被记录的</strong>，因为记录读操作没有意义。</p><blockquote><p>如何配置AOF持久化</p></blockquote><p>AOF持久化功能默认是不开启的，需要我们去修改<code>redis.conf</code>配置文件中的<code>appendonly</code>参数去开启AOF持久化（默认该参数为 no，即不开启），<code>appendfilename</code>参数去指定AOF持久化文件的名称（默认为 appendonly.aof）。</p><blockquote><p>AOF日志文件内容</p></blockquote><p>AOF日志文件其实就是普通文本，可以通过cat命令查看里面的内容，例如我们执行<code>set key1 value1</code>命令，AOF文件中则会写下如下内容：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>*3
$3
set
$4
key1
$6
value1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上诉内容中，「*3」代表当前命令有三个部分，每个部分都是以「$+数字」开头，后面跟具体命令、键或值。这里的「数字」表示这部分命令、键或值一共有多少字节，例如「$3 set」表示这部分有3个字节，也就是「set」命令这个字符串的长度。</p><h2 id="aof写回策略" tabindex="-1"><a class="header-anchor" href="#aof写回策略"><span>AOF写回策略</span></a></h2><p>Redis是先执行命令再将该命令写入到AOF文件中，这样做其实有两个好处：</p><ul><li><strong>避免额外的检查开销</strong>，只有执行成功后才将命令记录到AOF日志里，不用在写入前检查命令语法是否正确，保证每条写入AOF日志里的命令都是可执行且正确的。</li><li><strong>不会阻塞当前写操作命令的执行</strong>，因为只有写操作执行成功后才会将命令记录到AOF日志。</li></ul><p>当然，由于执行写操作命令和记录日志是两个过程，所以AOF持久化功能也存在一定的风险。</p><ul><li>当命令执行成功但是还没来得及写入到硬盘的时候，服务器发生了宕机，这个数据就会发生丢失。</li><li>虽然写操作命令执行成功后才会记录到AOF日志，不会阻塞当前命令的执行，但是会给「下一个」命令带来阻塞风险。因为将命令写入到日志的操作也是在主进程进行的，也就是说这两个操作是同步的，如果将日志写入到磁盘时，服务器的硬盘I/O压力太大，就会导致写硬盘的速度很慢，进而发生阻塞导致后续命令无法执行。</li></ul><p>认真分析可以发现两个风险都有一个共性，就是都跟<strong>AOF日志写回硬盘的时机</strong>有关。Redis写入AOF日志的过程大体如下：</p><p>1、Redis执行完写操作命令后，将命令追加到<code>server.aof_buf</code>缓冲区；</p><p>2、然后通过write()系统命令调用将aof_buf缓冲区到数据写入到AOF文件，此时数据并未写入到硬盘，而是拷贝到了内核缓冲区page cache，等待内核将数据写入到硬盘；</p><p>3、具体内核缓冲区的数据什么时候写入到硬盘，由内核决定；</p><p>Redis提供了3种写回硬盘的策略，控制的就是上面说的第三步的过程：</p><ul><li><strong>Always</strong>：每次执行完命令，同步将AOF日志数据写回到硬盘；最大程度保证数据不丢失，但是由于频繁落盘不可避免的影响主进程性能。</li><li><strong>Everysec</strong>：每次执行完命令，先将命令写入到AOF文件到内核缓冲区，然后每隔一秒再将缓冲区内容写回到硬盘；折中的方案，避免了Always的性能开销，也比No策略更能避免数据丢失，发生宕机时丢失一秒内的数据。</li><li><strong>No</strong>：每次执行完命令，先将命令写入到AOF文件到内核缓冲区，由操作系统决定何时将缓冲区内容写回硬盘；相比较Always性能较好，但是操作系统何时落盘是不可预知的，一旦服务器宕机就会丢失不定数量的数据。</li></ul><table><thead><tr><th>写回策略</th><th>写回时机</th><th>优点</th><th>缺点</th></tr></thead><tbody><tr><td>Always</td><td>同步写回</td><td>最大程度保证数据不丢失</td><td>每个写命令都要写回硬盘，性能开销大</td></tr><tr><td>Everysec</td><td>每秒写回</td><td>性能适中</td><td>机器宕机会丢失1秒内的数据</td></tr><tr><td>No</td><td>由操作系统控制写回</td><td>性能好</td><td>机器宕机可能会丢失很多数据</td></tr></tbody></table><blockquote><p>如何配置Redis写回策略</p></blockquote><p>修改<code>redis.coonf</code>配置文件中的<code>appendfsync</code>配置项，该配置项<strong>默认为everysec</strong>，即每秒将写入操作同步到磁盘一次。这种设置在一定程度上平衡了数据的持久性和性能之间的关系，提供了一定的数据安全性保障同时在一定程度上减少了磁盘同步操作对性能的影响。</p><h2 id="aof重写机制" tabindex="-1"><a class="header-anchor" href="#aof重写机制"><span>AOF重写机制</span></a></h2><p>随着写操作命令越来越多，AOF日志文件越来越大。AOF日志文件过大时就会带来性能问题，如重启Redis后需要读AOF文件的内容以恢复数据，如果文件过大，整个恢复过程就会很慢。Redis为避免这种情况提供了AOF重写，<strong>当AOF文件大小超过所设定的阈值后（AOF 重写的默认触发条件是当 AOF 文件大小超过 <code>auto-aof-rewrite-percentage</code> 和 <code>auto-aof-rewrite-min-size</code> 两个配置参数所设定的阈值时。）</strong>，Redis就会启动重写机制来压缩AOF文件。</p><ul><li><code>auto-aof-rewrite-percentage</code> 的值默认为 100，表示当当前 AOF 文件的大小达到上一次重写后的大小的 100%（即翻倍）时，Redis 将会尝试执行 AOF 重写操作。</li><li><code>auto-aof-rewrite-min-size</code> 的值默认为 64MB。这意味着当 AOF 文件的大小超过 64MB 时，Redis 将尝试执行 AOF 重写操作。</li></ul><p>AOF重写机制是在重写时，读取当前数据库中所有的键值对，然后将每一个键值对记录到「新的AOF文件中」，等到全部记录完后，就将新的AOF文件替换掉现有的AOF文件。例如在没执行重写机制前前后执行了「set key1 value1」和「set key1 value2」这两个命令的话，就会将这两个命令都写入到AOF文件，但是在使用重写机制后，就会读取最新的key-value键值对，然后用一条「set key1 value2」命令记录到新的AOF文件中，之前的「set key1 value1」就属于历史命令，没有必要记录了，这样一来一个键值对在重写日志中只用一条命令就可以了。</p><p>重写完成后会使用新的AOF文件替换现有的AOF文件，使得AOF文件变小。重写机制的作用就是<strong>尽管某个键值对被多条命令反复修改了多次，最终也只需要根据这个键值对当前最新状态，用一条命令去记录最新键值对，代替之前记录的多条命令</strong>，这样就减少了AOF文件中命令的数量。最后在完成工作后用最新的AOF文件覆盖现有的AOF文件。</p><p><strong>重写过程是先写到新的AOF文件，然后再覆盖过去</strong>，避免了AOF在重写过程中发生失败造成现有的AOF文件污染，如果重写失败，直接删除这个文件就好了，不会对现有的AOF文件造成影响。</p><h2 id="aof后台重写" tabindex="-1"><a class="header-anchor" href="#aof后台重写"><span>AOF后台重写</span></a></h2><p>重写是由<strong>后台子进程</strong>完成的。使用后台子进程原因：</p><ul><li>不阻塞主进程处理命令</li><li>子线程会共享内存，在发生变更操作时需要加锁，降低执行效率。子进程以只读的方式共享内存，如果发生变更就会产生写时复制，不用再通过加锁来保证数据安全。</li></ul><p>在重写期间主进程仍可执行命令，此时会维护一个<strong>AOF 重写缓冲区</strong>，在执行AOF重写期间，主进程需要执行以下三步</p><ul><li>执行客户端发来的命令</li><li>行命令追加到AOF缓存区</li><li>执行命令追加到AOF重写缓冲区</li></ul>`,33),d=[a];function i(s,r){return t(),o("div",null,d)}const A=e(l,[["render",i],["__file","AOF持久化.html.vue"]]),F=JSON.parse('{"path":"/redis/%E6%8C%81%E4%B9%85%E5%8C%96%E7%AF%87/AOF%E6%8C%81%E4%B9%85%E5%8C%96.html","title":"AOF持久化","lang":"zh-CN","frontmatter":{"title":"AOF持久化","order":1,"category":["Redis"],"description":"AOF日志 如果每执行一个写操作命令，就把该命令追加写入到一个文件，在重启Redis的时候读取文件中的命令并去执行它，就相当于恢复缓存数据了。这种保存写操作命令到日志的持久化方式就是AOF（Append Only File）持久化功能，注意只会记录写操作命令，读操作命令是不会被记录的，因为记录读操作没有意义。 如何配置AOF持久化 AOF持久化功能默认...","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/blogs/redis/%E6%8C%81%E4%B9%85%E5%8C%96%E7%AF%87/AOF%E6%8C%81%E4%B9%85%E5%8C%96.html"}],["meta",{"property":"og:site_name","content":"皮卡丘"}],["meta",{"property":"og:title","content":"AOF持久化"}],["meta",{"property":"og:description","content":"AOF日志 如果每执行一个写操作命令，就把该命令追加写入到一个文件，在重启Redis的时候读取文件中的命令并去执行它，就相当于恢复缓存数据了。这种保存写操作命令到日志的持久化方式就是AOF（Append Only File）持久化功能，注意只会记录写操作命令，读操作命令是不会被记录的，因为记录读操作没有意义。 如何配置AOF持久化 AOF持久化功能默认..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"皮卡丘"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"AOF持久化\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"皮卡丘\\",\\"url\\":\\"https://www.baidu.com\\"}]}"]]},"headers":[{"level":2,"title":"AOF日志","slug":"aof日志","link":"#aof日志","children":[]},{"level":2,"title":"AOF写回策略","slug":"aof写回策略","link":"#aof写回策略","children":[]},{"level":2,"title":"AOF重写机制","slug":"aof重写机制","link":"#aof重写机制","children":[]},{"level":2,"title":"AOF后台重写","slug":"aof后台重写","link":"#aof后台重写","children":[]}],"git":{"createdTime":null,"updatedTime":null,"contributors":[]},"readingTime":{"minutes":7.15,"words":2144},"filePathRelative":"redis/持久化篇/AOF持久化.md","excerpt":"<h2>AOF日志</h2>\\n<p>如果每执行一个写操作命令，就把该命令追加写入到一个文件，在重启Redis的时候读取文件中的命令并去执行它，就相当于恢复缓存数据了。这种保存写操作命令到日志的持久化方式就是AOF（Append Only File）持久化功能，<strong>注意只会记录写操作命令，读操作命令是不会被记录的</strong>，因为记录读操作没有意义。</p>\\n<blockquote>\\n<p>如何配置AOF持久化</p>\\n</blockquote>\\n<p>AOF持久化功能默认是不开启的，需要我们去修改<code>redis.conf</code>配置文件中的<code>appendonly</code>参数去开启AOF持久化（默认该参数为 no，即不开启），<code>appendfilename</code>参数去指定AOF持久化文件的名称（默认为 appendonly.aof）。</p>","autoDesc":true}');export{A as comp,F as data};
