package com.tiskel.linkedinskaner.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.tiskel.linkedinskaner.domain.Profile} entity.
 */
public class ProfileDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 2000)
    private String url;

    @NotNull
    private Boolean businessTarget;

    @Size(max = 2000)
    private String targetWords;

    @Size(max = 2000)
    private String blockedWords;

    private String title;

    private String description;

    private String location;

    @NotNull
    private Boolean isActive;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    private LeaderDTO leader;

    private Set<CampaignDTO> comapigns = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getBusinessTarget() {
        return businessTarget;
    }

    public void setBusinessTarget(Boolean businessTarget) {
        this.businessTarget = businessTarget;
    }

    public String getTargetWords() {
        return targetWords;
    }

    public void setTargetWords(String targetWords) {
        this.targetWords = targetWords;
    }

    public String getBlockedWords() {
        return blockedWords;
    }

    public void setBlockedWords(String blockedWords) {
        this.blockedWords = blockedWords;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public LeaderDTO getLeader() {
        return leader;
    }

    public void setLeader(LeaderDTO leader) {
        this.leader = leader;
    }

    public Set<CampaignDTO> getComapigns() {
        return comapigns;
    }

    public void setComapigns(Set<CampaignDTO> comapigns) {
        this.comapigns = comapigns;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProfileDTO)) {
            return false;
        }

        ProfileDTO profileDTO = (ProfileDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, profileDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProfileDTO{" +
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
            ", leader=" + getLeader() +
            ", comapigns=" + getComapigns() +
            "}";
    }
}
