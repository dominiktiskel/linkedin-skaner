package com.tiskel.linkedinskaner.service.mapper;

import com.tiskel.linkedinskaner.domain.Leader;
import com.tiskel.linkedinskaner.service.dto.LeaderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Leader} and its DTO {@link LeaderDTO}.
 */
@Mapper(componentModel = "spring")
public interface LeaderMapper extends EntityMapper<LeaderDTO, Leader> {}
