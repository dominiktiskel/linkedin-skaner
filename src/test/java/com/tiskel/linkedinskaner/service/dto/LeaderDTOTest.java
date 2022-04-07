package com.tiskel.linkedinskaner.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tiskel.linkedinskaner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LeaderDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaderDTO.class);
        LeaderDTO leaderDTO1 = new LeaderDTO();
        leaderDTO1.setId(1L);
        LeaderDTO leaderDTO2 = new LeaderDTO();
        assertThat(leaderDTO1).isNotEqualTo(leaderDTO2);
        leaderDTO2.setId(leaderDTO1.getId());
        assertThat(leaderDTO1).isEqualTo(leaderDTO2);
        leaderDTO2.setId(2L);
        assertThat(leaderDTO1).isNotEqualTo(leaderDTO2);
        leaderDTO1.setId(null);
        assertThat(leaderDTO1).isNotEqualTo(leaderDTO2);
    }
}
