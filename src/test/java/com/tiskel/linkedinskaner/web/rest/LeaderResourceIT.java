package com.tiskel.linkedinskaner.web.rest;

import static com.tiskel.linkedinskaner.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tiskel.linkedinskaner.IntegrationTest;
import com.tiskel.linkedinskaner.domain.Leader;
import com.tiskel.linkedinskaner.repository.LeaderRepository;
import com.tiskel.linkedinskaner.service.dto.LeaderDTO;
import com.tiskel.linkedinskaner.service.mapper.LeaderMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LeaderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LeaderResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/leaders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LeaderRepository leaderRepository;

    @Autowired
    private LeaderMapper leaderMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLeaderMockMvc;

    private Leader leader;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Leader createEntity(EntityManager em) {
        Leader leader = new Leader()
            .url(DEFAULT_URL)
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .location(DEFAULT_LOCATION)
            .isActive(DEFAULT_IS_ACTIVE)
            .created(DEFAULT_CREATED)
            .updated(DEFAULT_UPDATED);
        return leader;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Leader createUpdatedEntity(EntityManager em) {
        Leader leader = new Leader()
            .url(UPDATED_URL)
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .location(UPDATED_LOCATION)
            .isActive(UPDATED_IS_ACTIVE)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED);
        return leader;
    }

    @BeforeEach
    public void initTest() {
        leader = createEntity(em);
    }

    @Test
    @Transactional
    void createLeader() throws Exception {
        int databaseSizeBeforeCreate = leaderRepository.findAll().size();
        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);
        restLeaderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderDTO)))
            .andExpect(status().isCreated());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeCreate + 1);
        Leader testLeader = leaderList.get(leaderList.size() - 1);
        assertThat(testLeader.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testLeader.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testLeader.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLeader.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testLeader.getIsActive()).isEqualTo(DEFAULT_IS_ACTIVE);
        assertThat(testLeader.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testLeader.getUpdated()).isEqualTo(DEFAULT_UPDATED);
    }

    @Test
    @Transactional
    void createLeaderWithExistingId() throws Exception {
        // Create the Leader with an existing ID
        leader.setId(1L);
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        int databaseSizeBeforeCreate = leaderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIsActiveIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaderRepository.findAll().size();
        // set the field null
        leader.setIsActive(null);

        // Create the Leader, which fails.
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        restLeaderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderDTO)))
            .andExpect(status().isBadRequest());

        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLeaders() throws Exception {
        // Initialize the database
        leaderRepository.saveAndFlush(leader);

        // Get all the leaderList
        restLeaderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leader.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].updated").value(hasItem(sameInstant(DEFAULT_UPDATED))));
    }

    @Test
    @Transactional
    void getLeader() throws Exception {
        // Initialize the database
        leaderRepository.saveAndFlush(leader);

        // Get the leader
        restLeaderMockMvc
            .perform(get(ENTITY_API_URL_ID, leader.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(leader.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.updated").value(sameInstant(DEFAULT_UPDATED)));
    }

    @Test
    @Transactional
    void getNonExistingLeader() throws Exception {
        // Get the leader
        restLeaderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLeader() throws Exception {
        // Initialize the database
        leaderRepository.saveAndFlush(leader);

        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();

        // Update the leader
        Leader updatedLeader = leaderRepository.findById(leader.getId()).get();
        // Disconnect from session so that the updates on updatedLeader are not directly saved in db
        em.detach(updatedLeader);
        updatedLeader
            .url(UPDATED_URL)
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .location(UPDATED_LOCATION)
            .isActive(UPDATED_IS_ACTIVE)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED);
        LeaderDTO leaderDTO = leaderMapper.toDto(updatedLeader);

        restLeaderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leaderDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderDTO))
            )
            .andExpect(status().isOk());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
        Leader testLeader = leaderList.get(leaderList.size() - 1);
        assertThat(testLeader.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testLeader.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testLeader.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLeader.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testLeader.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
        assertThat(testLeader.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testLeader.getUpdated()).isEqualTo(UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void putNonExistingLeader() throws Exception {
        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();
        leader.setId(count.incrementAndGet());

        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leaderDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLeader() throws Exception {
        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();
        leader.setId(count.incrementAndGet());

        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLeader() throws Exception {
        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();
        leader.setId(count.incrementAndGet());

        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLeaderWithPatch() throws Exception {
        // Initialize the database
        leaderRepository.saveAndFlush(leader);

        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();

        // Update the leader using partial update
        Leader partialUpdatedLeader = new Leader();
        partialUpdatedLeader.setId(leader.getId());

        partialUpdatedLeader.url(UPDATED_URL).description(UPDATED_DESCRIPTION).isActive(UPDATED_IS_ACTIVE).updated(UPDATED_UPDATED);

        restLeaderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeader.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeader))
            )
            .andExpect(status().isOk());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
        Leader testLeader = leaderList.get(leaderList.size() - 1);
        assertThat(testLeader.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testLeader.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testLeader.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLeader.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testLeader.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
        assertThat(testLeader.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testLeader.getUpdated()).isEqualTo(UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void fullUpdateLeaderWithPatch() throws Exception {
        // Initialize the database
        leaderRepository.saveAndFlush(leader);

        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();

        // Update the leader using partial update
        Leader partialUpdatedLeader = new Leader();
        partialUpdatedLeader.setId(leader.getId());

        partialUpdatedLeader
            .url(UPDATED_URL)
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .location(UPDATED_LOCATION)
            .isActive(UPDATED_IS_ACTIVE)
            .created(UPDATED_CREATED)
            .updated(UPDATED_UPDATED);

        restLeaderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeader.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeader))
            )
            .andExpect(status().isOk());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
        Leader testLeader = leaderList.get(leaderList.size() - 1);
        assertThat(testLeader.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testLeader.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testLeader.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLeader.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testLeader.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
        assertThat(testLeader.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testLeader.getUpdated()).isEqualTo(UPDATED_UPDATED);
    }

    @Test
    @Transactional
    void patchNonExistingLeader() throws Exception {
        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();
        leader.setId(count.incrementAndGet());

        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, leaderDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLeader() throws Exception {
        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();
        leader.setId(count.incrementAndGet());

        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLeader() throws Exception {
        int databaseSizeBeforeUpdate = leaderRepository.findAll().size();
        leader.setId(count.incrementAndGet());

        // Create the Leader
        LeaderDTO leaderDTO = leaderMapper.toDto(leader);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(leaderDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Leader in the database
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLeader() throws Exception {
        // Initialize the database
        leaderRepository.saveAndFlush(leader);

        int databaseSizeBeforeDelete = leaderRepository.findAll().size();

        // Delete the leader
        restLeaderMockMvc
            .perform(delete(ENTITY_API_URL_ID, leader.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Leader> leaderList = leaderRepository.findAll();
        assertThat(leaderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
