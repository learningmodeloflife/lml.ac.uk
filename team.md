---
layout: default
title: "Team | Learning Model of Life | Decoding the Rules of Biology"
description: "Learn about the Learning Model of Life initiative, our mission to decode the rules of biology, and our interdisciplinary approach combining deep biological expertise with leading AI research."
keywords:
  - A summary of the Learning Model of Life team members
---

<div class="team-content">
    <h1 class="team-title">Team</h1>
    <div class="team-grid">
    {% assign grouped_by_weight = site.team | group_by: "weight" | sort: "name" %}
    {% for weight_group in grouped_by_weight %}
        {% assign people = weight_group.items | sort: "name" %}
        {% for member in people %}
        <div class="team-member">
            <div class="member-image">
                {% if member.img %}
                <img class="img-fluid rounded float-start mr-4" src="{{member.img  | relative_url }}" alt="{{member.name}}">
                {% endif %}
            </div>
            <h3>
                {{member.name}}
            </h3>
            <p>{{member.role}}</p>
        </div>
        {% endfor %}
    {% endfor %}
    </div>
</div>

