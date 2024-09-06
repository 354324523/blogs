import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as p,c,d as n,f as a,b as e,e as l}from"./app-DWz5k_-z.js";const i={},r=l(`<h2 id="布隆过滤器" tabindex="-1"><a class="header-anchor" href="#布隆过滤器"><span>布隆过滤器</span></a></h2><p>原理：</p><p><strong>查询布隆过滤器说数据存在，并不一定证明数据库中存在这个数据，但是查询到数据不存在，数据库中一定就不存在这个数据</strong>。</p><p>实例代码：</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">from</span> pybloom_live <span class="token keyword">import</span> BloomFilter

<span class="token comment"># 初始化布隆过滤器</span>
bloom <span class="token operator">=</span> BloomFilter<span class="token punctuation">(</span>capacity<span class="token operator">=</span><span class="token number">100000</span><span class="token punctuation">,</span> error_rate<span class="token operator">=</span><span class="token number">0.001</span><span class="token punctuation">)</span>

<span class="token comment"># 在数据写入数据库时更新布隆过滤器</span>
<span class="token keyword">def</span> <span class="token function">add_to_bloom_filter</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">:</span>
    bloom<span class="token punctuation">.</span>add<span class="token punctuation">(</span>key<span class="token punctuation">)</span>

<span class="token comment"># 查询时使用布隆过滤器</span>
<span class="token keyword">def</span> <span class="token function">get_data</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> key <span class="token keyword">not</span> <span class="token keyword">in</span> bloom<span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token boolean">None</span>
    value <span class="token operator">=</span> redis_client<span class="token punctuation">.</span>get<span class="token punctuation">(</span>key<span class="token punctuation">)</span>
    <span class="token keyword">if</span> value <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        value <span class="token operator">=</span> fetch_data_from_db<span class="token punctuation">(</span>key<span class="token punctuation">)</span>
        <span class="token keyword">if</span> value <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
            redis_client<span class="token punctuation">.</span>setex<span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token number">60</span><span class="token punctuation">,</span> <span class="token string">&quot;NULL&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">else</span><span class="token punctuation">:</span>
            redis_client<span class="token punctuation">.</span>setex<span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token number">3600</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
    <span class="token keyword">elif</span> value <span class="token operator">==</span> <span class="token string">&quot;NULL&quot;</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token boolean">None</span>
    <span class="token keyword">return</span> value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参考链接：</p>`,6),u={href:"https://segmentfault.com/a/1190000039156246",target:"_blank",rel:"noopener noreferrer"},k={href:"https://www.cnblogs.com/yscl/p/12003359.html",target:"_blank",rel:"noopener noreferrer"};function d(m,y){const s=o("ExternalLinkIcon");return p(),c("div",null,[r,n("blockquote",null,[n("p",null,[n("a",u,[a("布隆，牛逼！布谷鸟，牛逼！"),e(s)])]),n("p",null,[n("a",k,[a("python-布隆过滤器"),e(s)])])])])}const _=t(i,[["render",d],["__file","布隆过滤器与布谷鸟过滤器.html.vue"]]),h=JSON.parse('{"path":"/redis/%E5%BA%94%E7%94%A8%E7%AF%87/%E5%B8%83%E9%9A%86%E8%BF%87%E6%BB%A4%E5%99%A8%E4%B8%8E%E5%B8%83%E8%B0%B7%E9%B8%9F%E8%BF%87%E6%BB%A4%E5%99%A8.html","title":"布隆过滤器与布谷鸟过滤器","lang":"zh-CN","frontmatter":{"title":"布隆过滤器与布谷鸟过滤器","order":2,"category":["Redis"],"description":"布隆过滤器 原理： 查询布隆过滤器说数据存在，并不一定证明数据库中存在这个数据，但是查询到数据不存在，数据库中一定就不存在这个数据。 实例代码： 参考链接： 布隆，牛逼！布谷鸟，牛逼！ python-布隆过滤器","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/blogs/redis/%E5%BA%94%E7%94%A8%E7%AF%87/%E5%B8%83%E9%9A%86%E8%BF%87%E6%BB%A4%E5%99%A8%E4%B8%8E%E5%B8%83%E8%B0%B7%E9%B8%9F%E8%BF%87%E6%BB%A4%E5%99%A8.html"}],["meta",{"property":"og:site_name","content":"皮卡丘"}],["meta",{"property":"og:title","content":"布隆过滤器与布谷鸟过滤器"}],["meta",{"property":"og:description","content":"布隆过滤器 原理： 查询布隆过滤器说数据存在，并不一定证明数据库中存在这个数据，但是查询到数据不存在，数据库中一定就不存在这个数据。 实例代码： 参考链接： 布隆，牛逼！布谷鸟，牛逼！ python-布隆过滤器"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"皮卡丘"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"布隆过滤器与布谷鸟过滤器\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"皮卡丘\\",\\"url\\":\\"https://www.baidu.com\\"}]}"]]},"headers":[{"level":2,"title":"布隆过滤器","slug":"布隆过滤器","link":"#布隆过滤器","children":[]}],"git":{"createdTime":null,"updatedTime":null,"contributors":[]},"readingTime":{"minutes":0.64,"words":193},"filePathRelative":"redis/应用篇/布隆过滤器与布谷鸟过滤器.md","excerpt":"<h2>布隆过滤器</h2>\\n<p>原理：</p>\\n<p><strong>查询布隆过滤器说数据存在，并不一定证明数据库中存在这个数据，但是查询到数据不存在，数据库中一定就不存在这个数据</strong>。</p>\\n<p>实例代码：</p>\\n<div class=\\"language-python\\" data-ext=\\"py\\" data-title=\\"py\\"><pre class=\\"language-python\\"><code><span class=\\"token keyword\\">from</span> pybloom_live <span class=\\"token keyword\\">import</span> BloomFilter\\n\\n<span class=\\"token comment\\"># 初始化布隆过滤器</span>\\nbloom <span class=\\"token operator\\">=</span> BloomFilter<span class=\\"token punctuation\\">(</span>capacity<span class=\\"token operator\\">=</span><span class=\\"token number\\">100000</span><span class=\\"token punctuation\\">,</span> error_rate<span class=\\"token operator\\">=</span><span class=\\"token number\\">0.001</span><span class=\\"token punctuation\\">)</span>\\n\\n<span class=\\"token comment\\"># 在数据写入数据库时更新布隆过滤器</span>\\n<span class=\\"token keyword\\">def</span> <span class=\\"token function\\">add_to_bloom_filter</span><span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">:</span>\\n    bloom<span class=\\"token punctuation\\">.</span>add<span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span>\\n\\n<span class=\\"token comment\\"># 查询时使用布隆过滤器</span>\\n<span class=\\"token keyword\\">def</span> <span class=\\"token function\\">get_data</span><span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">:</span>\\n    <span class=\\"token keyword\\">if</span> key <span class=\\"token keyword\\">not</span> <span class=\\"token keyword\\">in</span> bloom<span class=\\"token punctuation\\">:</span>\\n        <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">None</span>\\n    value <span class=\\"token operator\\">=</span> redis_client<span class=\\"token punctuation\\">.</span>get<span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span>\\n    <span class=\\"token keyword\\">if</span> value <span class=\\"token keyword\\">is</span> <span class=\\"token boolean\\">None</span><span class=\\"token punctuation\\">:</span>\\n        value <span class=\\"token operator\\">=</span> fetch_data_from_db<span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span>\\n        <span class=\\"token keyword\\">if</span> value <span class=\\"token keyword\\">is</span> <span class=\\"token boolean\\">None</span><span class=\\"token punctuation\\">:</span>\\n            redis_client<span class=\\"token punctuation\\">.</span>setex<span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">60</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"NULL\\"</span><span class=\\"token punctuation\\">)</span>\\n        <span class=\\"token keyword\\">else</span><span class=\\"token punctuation\\">:</span>\\n            redis_client<span class=\\"token punctuation\\">.</span>setex<span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">3600</span><span class=\\"token punctuation\\">,</span> value<span class=\\"token punctuation\\">)</span>\\n    <span class=\\"token keyword\\">elif</span> value <span class=\\"token operator\\">==</span> <span class=\\"token string\\">\\"NULL\\"</span><span class=\\"token punctuation\\">:</span>\\n        <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">None</span>\\n    <span class=\\"token keyword\\">return</span> value\\n</code></pre></div>","autoDesc":true}');export{_ as comp,h as data};
