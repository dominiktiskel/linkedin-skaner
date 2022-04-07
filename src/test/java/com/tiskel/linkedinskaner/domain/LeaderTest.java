package com.tiskel.linkedinskaner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tiskel.linkedinskaner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LeaderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Leader.class);
        Leader leader1 = new Leader();
        leader1.setId(1L);
        Leader leader2 = new Leader();
        leader2.setId(leader1.getId());
        assertThat(leader1).isEqualTo(leader2);
        leader2.setId(2L);
        assertThat(leader1).isNotEqualTo(leader2);
        leader1.setId(null);
        assertThat(leader1).isNotEqualTo(leader2);
    }
}
