package com.tiskel.linkedinskaner.repository;

import com.tiskel.linkedinskaner.domain.Profile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface ProfileRepositoryWithBagRelationships {
    Optional<Profile> fetchBagRelationships(Optional<Profile> profile);

    List<Profile> fetchBagRelationships(List<Profile> profiles);

    Page<Profile> fetchBagRelationships(Page<Profile> profiles);
}
