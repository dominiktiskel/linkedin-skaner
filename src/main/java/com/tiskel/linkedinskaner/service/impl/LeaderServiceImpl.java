package com.tiskel.linkedinskaner.service.impl;

import com.tiskel.linkedinskaner.domain.Leader;
import com.tiskel.linkedinskaner.repository.LeaderRepository;
import com.tiskel.linkedinskaner.service.LeaderService;
import com.tiskel.linkedinskaner.service.dto.LeaderDTO;
import com.tiskel.linkedinskaner.service.mapper.LeaderMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Leader}.
 */
@Service
@Transactional
public class LeaderServiceImpl implements LeaderService {

    private final Logger log = LoggerFactory.getLogger(LeaderServiceImpl.class);

    private final LeaderRepository leaderRepository;

    private final LeaderMapper leaderMapper;

    public LeaderServiceImpl(LeaderRepository leaderRepository, LeaderMapper leaderMapper) {
        this.leaderRepository = leaderRepository;
        this.leaderMapper = leaderMapper;
    }

    @Override
    public LeaderDTO save(LeaderDTO leaderDTO) {
        log.debug("Request to save Leader : {}", leaderDTO);
        Leader leader = leaderMapper.toEntity(leaderDTO);
        leader = leaderRepository.save(leader);
        return leaderMapper.toDto(leader);
    }

    @Override
    public LeaderDTO update(LeaderDTO leaderDTO) {
        log.debug("Request to save Leader : {}", leaderDTO);
        Leader leader = leaderMapper.toEntity(leaderDTO);
        leader = leaderRepository.save(leader);
        return leaderMapper.toDto(leader);
    }

    @Override
    public Optional<LeaderDTO> partialUpdate(LeaderDTO leaderDTO) {
        log.debug("Request to partially update Leader : {}", leaderDTO);

        return leaderRepository
            .findById(leaderDTO.getId())
            .map(existingLeader -> {
                leaderMapper.partialUpdate(existingLeader, leaderDTO);

                return existingLeader;
            })
            .map(leaderRepository::save)
            .map(leaderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeaderDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Leaders");
        return leaderRepository.findAll(pageable).map(leaderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LeaderDTO> findOne(Long id) {
        log.debug("Request to get Leader : {}", id);
        return leaderRepository.findById(id).map(leaderMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Leader : {}", id);
        leaderRepository.deleteById(id);
    }
}
