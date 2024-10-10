---
layout: default
title: "Our Work | Learning Model of Life | Decoding the Rules of Biology"
description: "Learn about the Learning Model of Life initiative, our mission to decode the rules of biology, and our interdisciplinary approach combining deep biological expertise with leading AI research."
---



<div class="work-content">
    <h1 class="work-title">Our Work</h1>
    <div class="article-grid">

{% assign sortedoutputs = site.work | sort: "weight" %}
{% for output in sortedoutputs %}

    <h4 class="output-title">
        <a href="{{site.baseurl}}{{ output.url }}">{{ output.title }}</a>
    </h4>
    {% if output.doi %}
    {% if output.journal %}
      <a href="{{output.doi}}">{{output.journal}} 
      {% if output.month %}
        {{output.month}} 
        {% if output.year %}
          {{output.year}} 
        {% endif %}
      {% endif %}
      </a>
    {% endif %}
    {% endif %}
      <p>{{ output.content | markdownify | strip_html | truncate: 250 }}</p>
    {% if output.doi %}
      <div class="altmetric-embed" data-badge-type="donut" data-doi="{{output.doi}}"></div>
    {% endif %}

{% endfor %}
    </div>
</div>


  
  