---
layout: null
sitemap: false
---

{% comment %}
Updated from So Simple's search-data.js:

* made the number of words to include in the excerpt configurable
* added the ability to include explicit search search terms for a post
* added unique words from the post into its search context for better search results
{% endcomment %}

var store = [
  {%- for c in site.collections -%}
    {%- if forloop.last -%}
      {%- assign l = true -%}
    {%- endif -%}
    {%- assign docs = c.docs | where_exp: 'doc', 'doc.search != false' -%}
    {%- for doc in docs -%}
      {
        {%- assign doc_content = doc.content |
            replace:"</p>", " " | 
            replace:"</h1>", " " | 
            replace:"</h2>", " " | 
            replace:"</h3>", " " | 
            replace:"</h4>", " " | 
            replace:"</h5>", " " | 
            replace:"</h6>", " "|
            strip_html |
            strip_newlines -%}
        {%- assign doc_words = doc_content |
            downcase |
            replace: ".", " " |
            replace: ",", " " |
            replace: "!", " " |
            replace: "?", " " |
            replace: ";", " " |
            replace: ":", " " |
            normalize_whitespace |
            split: " " |
            compact -%}
        "title": {{ doc.title | jsonify }},
        {% if site.search_full_content == true %}
        "excerpt": {{ doc_content |  jsonify }},
        {%- else -%}
        "excerpt": {{ doc_content | truncatewords: site.search_excerpt_word_length | jsonify }},
        "unique_words": {{ doc_words | uniq | where_exp: "word", "word.size >= site.search_min_word_length" | slice: 0, site.search_context_unique_word_count | jsonify }},
        {% endif -%}
        "search_terms": {{ doc.search_terms | jsonify }},
        "categories": {{ doc.categories | jsonify }},
        "tags": {{ doc.tags | jsonify }},
        "url": {{ doc.url | absolute_url | jsonify }}
      } {%- unless forloop.last and l -%}, {%- endunless -%}
    {%- endfor -%}
  {%- endfor -%}
]