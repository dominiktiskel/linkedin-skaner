package com.tiskel.linkedinskaner.web.rest;

import com.tiskel.linkedinskaner.repository.LeaderRepository;
import com.tiskel.linkedinskaner.service.LeaderService;
import com.tiskel.linkedinskaner.service.dto.LeaderDTO;
import com.tiskel.linkedinskaner.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tiskel.linkedinskaner.domain.Leader}.
 */
@RestController
@RequestMapping("/api")
public class LeaderResource {

    private final Logger log = LoggerFactory.getLogger(LeaderResource.class);

    private static final String ENTITY_NAME = "leader";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LeaderService leaderService;

    private final LeaderRepository leaderRepository;

    public LeaderResource(LeaderService leaderService, LeaderRepository leaderRepository) {
        this.leaderService = leaderService;
        this.leaderRepository = leaderRepository;
    }

    /**
     * {@code POST  /leaders} : Create a new leader.
     *
     * @param leaderDTO the leaderDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new leaderDTO, or with status {@code 400 (Bad Request)} if the leader has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/leaders")
    public ResponseEntity<LeaderDTO> createLeader(@Valid @RequestBody LeaderDTO leaderDTO) throws URISyntaxException {
        log.debug("REST request to save Leader : {}", leaderDTO);
        if (leaderDTO.getId() != null) {
            throw new BadRequestAlertException("A new leader cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaderDTO result = leaderService.save(leaderDTO);
        return ResponseEntity
            .created(new URI("/api/leaders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /leaders/:id} : Updates an existing leader.
     *
     * @param id the id of the leaderDTO to save.
     * @param leaderDTO the leaderDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaderDTO,
     * or with status {@code 400 (Bad Request)} if the leaderDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the leaderDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/leaders/{id}")
    public ResponseEntity<LeaderDTO> updateLeader(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LeaderDTO leaderDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Leader : {}, {}", id, leaderDTO);
        if (leaderDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaderDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LeaderDTO result = leaderService.update(leaderDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leaderDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /leaders/:id} : Partial updates given fields of an existing leader, field will ignore if it is null
     *
     * @param id the id of the leaderDTO to save.
     * @param leaderDTO the leaderDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaderDTO,
     * or with status {@code 400 (Bad Request)} if the leaderDTO is not valid,
     * or with status {@code 404 (Not Found)} if the leaderDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the leaderDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/leaders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LeaderDTO> partialUpdateLeader(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LeaderDTO leaderDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Leader partially : {}, {}", id, leaderDTO);
        if (leaderDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaderDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LeaderDTO> result = leaderService.partialUpdate(leaderDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leaderDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /leaders} : get all the leaders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of leaders in body.
     */
    @GetMapping("/leaders")
    public ResponseEntity<List<LeaderDTO>> getAllLeaders(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Leaders");
        Page<LeaderDTO> page = leaderService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /leaders/:id} : get the "id" leader.
     *
     * @param id the id of the leaderDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the leaderDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/leaders/{id}")
    public ResponseEntity<LeaderDTO> getLeader(@PathVariable Long id) {
        log.debug("REST request to get Leader : {}", id);
        Optional<LeaderDTO> leaderDTO = leaderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(leaderDTO);
    }

    /**
     * {@code DELETE  /leaders/:id} : delete the "id" leader.
     *
     * @param id the id of the leaderDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/leaders/{id}")
    public ResponseEntity<Void> deleteLeader(@PathVariable Long id) {
        log.debug("REST request to delete Leader : {}", id);
        leaderService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
