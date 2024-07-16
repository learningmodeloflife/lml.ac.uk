---
layout: page
title: People
permalink: /people/
---

{% assign grouped_by_weight = site.people | group_by: "weight" | sort: "name" %}

{% for weight_group in grouped_by_weight %}
    {% assign people = weight_group.items | sort: "name" %}
        {% for member in people  %}
<div class="row">
    {% include person-card.html %}
</div>
    {% endfor %}
{% endfor %}
