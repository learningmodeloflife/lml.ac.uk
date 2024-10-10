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

  {% if output.img %} <!-- IF NO IMAGE, NOTHING APPEARS -->
    {% if output.doi %}
      <a href="https://doi.org/{{output.doi}}" target="_blank" rel="noopener noreferrer" class="article-link">
    {% else %}
      <a href="https://baillielab.net" target="_blank" rel="noopener noreferrer" class="article-link">
    {% endif %}
          <div class="article-item">
              <img src="{{ output.img }}" alt="Image of front page of {{ output.title }}" class="article-image">
              <div class="article-info">
                {% if output.author_short %}
                  <p>{{ output.author_short }}</p>
                {% endif %}
                {% if output.journal %}
                  <p>{{ output.journal }}</p>
                {% endif %}
                {% if output.date %}
                  <p>{{ output.date | date: "%Y" }}</p>
                {% endif %}
              </div>
          </div>
      </a>
  {% endif %} 

{% endfor %}
    </div>
</div>













  