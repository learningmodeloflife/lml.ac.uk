---
title: List
layout: page
---

<ul>
{% for file in site.static_files %}
{% if file.path contains '/slides/' and file.extname == '.html' and file.name != 'index.html' and file.name != 'l.html' %}
<li><a href="{{ file.path }}">{{ file.name }}</a><br></li>
{% endif %}
{% endfor %}
</ul>