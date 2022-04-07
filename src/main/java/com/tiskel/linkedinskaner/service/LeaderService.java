package com.tiskel.linkedinskaner.service;

import com.tiskel.linkedinskaner.service.dto.LeaderDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.tiskel.linkedinskaner.domain.Leader}.
 */
public interface LeaderService {
    /**
     * Save a leader.
     *
     * @param leaderDTO the entity to save.
     * @return the persisted entity.
     */
    LeaderDTO save(LeaderDTO leaderDTO);

    /**
     * Updates a leader.
     *
     * @param leaderDTO the entity to update.
     * @return the persisted entity.
     */
    LeaderDTO update(LeaderDTO leaderDTO);

    /**
     * Partially updates a leader.
     *
     * @param leaderDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LeaderDTO> partialUpdate(LeaderDTO leaderDTO);

    /**
     * Get all the leaders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LeaderDTO> findAll(Pageable pageable);

    /**
     * Get the "id" leader.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LeaderDTO> findOne(Long id);

    /**
     * Delete the "id" leader.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
