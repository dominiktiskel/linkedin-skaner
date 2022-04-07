package com.tiskel.linkedinskaner.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LeaderMapperTest {

    private LeaderMapper leaderMapper;

    @BeforeEach
    public void setUp() {
        leaderMapper = new LeaderMapperImpl();
    }
}
