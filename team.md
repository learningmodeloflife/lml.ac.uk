---
layout: default
title: "Team | Learning Model of Life | Decoding the Rules of Biology"
description: "Learn about the Learning Model of Life initiative, our mission to decode the rules of biology, and our interdisciplinary approach combining deep biological expertise with leading AI research."
---

<div class="team-content">
    <h1 class="team-title">Team</h1>
    <div class="team-grid">
    {% assign grouped_by_weight = site.team | group_by: "weight" | sort: "name" %}
    {% for weight_group in grouped_by_weight %}
        {% assign people = weight_group.items | sort: "name" %}
        {% for member in people %}
            {% include person-card.html %}
        {% endfor %}
    {% endfor %}
    </div>
</div>

