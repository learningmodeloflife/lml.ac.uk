---
layout: default
title: "Our Work | Learning Model of Life | Decoding the Rules of Biology"
description: "An overview of academic works from the Learning Model of Life team"
---

<div class="work-content">
    <h1 class="work-title">Our Work</h1>
    <div class="article-grid">

{% assign sortedoutputs = site.work | sort: "weight" %}
{% for output in sortedoutputs %}

  {% if output.img %} <!-- IF NO IMAGE, NOTHING APPEARS -->
    <div class="article-item">
        <img src="{{ output.img }}" alt="Image of front page of {{ output.title }}" class="article-image lazy" data-src="{{ output.img_small }}">
        <div class="article-info">
          {% if output.author_short %}
            {% if output.doi %}
              <a href="https://doi.org/{{output.doi}}" target="_blank" rel="noopener noreferrer" class="article-link">
                <p class="article-author">{{ output.author_short }}</p>
              </a>
            {% else %}
              <a href="https://baillielab.net" target="_blank" rel="noopener noreferrer" class="article-link">
                <p class="article-author">{{ output.author_short }}</p>
              </a>
            {% endif %}
          {% endif %}
          {% if output.journal or output.date %}
            <p class="article-journal-date">
              {% if output.journal %}
                {{ output.journal }}
              {% endif %}
              {% if output.journal and output.date %}

              {% endif %}
              {% if output.date %}
               ({{ output.date | date: "%Y" }})
              {% endif %}
            </p>
          {% endif %}
        </div>
    </div>
  {% endif %} 

{% endfor %}
    </div>
</div>













  