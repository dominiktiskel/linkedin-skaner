package com.tiskel.linkedinskaner.service.mapper;

import com.tiskel.linkedinskaner.domain.Campaign;
import com.tiskel.linkedinskaner.service.dto.CampaignDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Campaign} and its DTO {@link CampaignDTO}.
 */
@Mapper(componentModel = "spring")
public interface CampaignMapper extends EntityMapper<CampaignDTO, Campaign> {}
