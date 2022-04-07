package com.tiskel.linkedinskaner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Profile.
 */
@Entity
@Table(name = "profile")
public class Profile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 2000)
    @Column(name = "url", length = 2000, nullable = false)
    private String url;

    @NotNull
    @Column(name = "business_target", nullable = false)
    private Boolean businessTarget;

    @Size(max = 2000)
    @Column(name = "target_words", length = 2000)
    private String targetWords;

    @Size(max = 2000)
    @Column(name = "blocked_words", length = 2000)
    private String blockedWords;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "location")
    private String location;

    @NotNull
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "updated")
    private ZonedDateTime updated;

    @ManyToOne
    private Leader leader;

    @ManyToMany
    @JoinTable(
        name = "rel_profile__comapign",
        joinColumns = @JoinColumn(name = "profile_id"),
        inverseJoinColumns = @JoinColumn(name = "comapign_id")
    )
    @JsonIgnoreProperties(value = { "profiles" }, allowSetters = true)
    private Set<Campaign> comapigns = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Profile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return this.url;
    }

    public Profile url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getBusinessTarget() {
        return this.businessTarget;
    }

    public Profile businessTarget(Boolean businessTarget) {
        this.setBusinessTarget(businessTarget);
        return this;
    }

    public void setBusinessTarget(Boolean businessTarget) {
        this.businessTarget = businessTarget;
    }

    public String getTargetWords() {
        return this.targetWords;
    }

    public Profile targetWords(String targetWords) {
        this.setTargetWords(targetWords);
        return this;
    }

    public void setTargetWords(String targetWords) {
        this.targetWords = targetWords;
    }

    public String getBlockedWords() {
        return this.blockedWords;
    }

    public Profile blockedWords(String blockedWords) {
        this.setBlockedWords(blockedWords);
        return this;
    }

    public void setBlockedWords(String blockedWords) {
        this.blockedWords = blockedWords;
    }

    public String getTitle() {
        return this.title;
    }

    public Profile title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Profile description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return this.location;
    }

    public Profile location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Profile isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public Profile created(ZonedDateTime created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return this.updated;
    }

    public Profile updated(ZonedDateTime updated) {
        this.setUpdated(updated);
        return this;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public Leader getLeader() {
        return this.leader;
    }

    public void setLeader(Leader leader) {
        this.leader = leader;
    }

    public Profile leader(Leader leader) {
        this.setLeader(leader);
        return this;
    }

    public Set<Campaign> getComapigns() {
        return this.comapigns;
    }

    public void setComapigns(Set<Campaign> campaigns) {
        this.comapigns = campaigns;
    }

    public Profile comapigns(Set<Campaign> campaigns) {
        this.setComapigns(campaigns);
        return this;
    }

    public Profile addComapign(Campaign campaign) {
        this.comapigns.add(campaign);
        campaign.getProfiles().add(this);
        return this;
    }

    public Profile removeComapign(Campaign campaign) {
        this.comapigns.remove(campaign);
        campaign.getProfiles().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Profile)) {
            return false;
        }
        return id != null && id.equals(((Profile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Profile{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            ", businessTarget='" + getBusinessTarget() + "'" +
            ", targetWords='" + getTargetWords() + "'" +
            ", blockedWords='" + getBlockedWords() + "'" +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", location='" + getLocation() + "'" +
            ", isActive='" + getIsActive() + "'" +
            ", created='" + getCreated() + "'" +
            ", updated='" + getUpdated() + "'" +
            "}";
    }
}
