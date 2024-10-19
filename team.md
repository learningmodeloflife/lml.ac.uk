---
layout: default
title: "Team | Learning Model of Life | Decoding the Rules of Biology"
description: "A summary of the Learning Model of Life team members."
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
                <img class="img-fluid rounded float-start mr-4" src="{{member.img  | replace: '.jpg', '.webp' | relative_url }}" alt="{{member.name}}">
                {% endif %}
            </div>
            <h2>
                {{member.name}}
            </h2>
            <p>{{member.role}}</p>
        </div>
        {% endfor %}
    {% endfor %}
    </div>
</div>

