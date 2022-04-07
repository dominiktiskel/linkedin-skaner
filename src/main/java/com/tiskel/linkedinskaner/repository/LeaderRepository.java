package com.tiskel.linkedinskaner.repository;

import com.tiskel.linkedinskaner.domain.Leader;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Leader entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaderRepository extends JpaRepository<Leader, Long> {}
