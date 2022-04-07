package com.tiskel.linkedinskaner.repository;

import com.tiskel.linkedinskaner.domain.Profile;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProfileRepositoryWithBagRelationshipsImpl implements ProfileRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Profile> fetchBagRelationships(Optional<Profile> profile) {
        return profile.map(this::fetchComapigns);
    }

    @Override
    public Page<Profile> fetchBagRelationships(Page<Profile> profiles) {
        return new PageImpl<>(fetchBagRelationships(profiles.getContent()), profiles.getPageable(), profiles.getTotalElements());
    }

    @Override
    public List<Profile> fetchBagRelationships(List<Profile> profiles) {
        return Optional.of(profiles).map(this::fetchComapigns).orElse(Collections.emptyList());
    }

    Profile fetchComapigns(Profile result) {
        return entityManager
            .createQuery("select profile from Profile profile left join fetch profile.comapigns where profile is :profile", Profile.class)
            .setParameter("profile", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Profile> fetchComapigns(List<Profile> profiles) {
        return entityManager
            .createQuery(
                "select distinct profile from Profile profile left join fetch profile.comapigns where profile in :profiles",
                Profile.class
            )
            .setParameter("profiles", profiles)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
