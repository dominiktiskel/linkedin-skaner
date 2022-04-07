package com.tiskel.linkedinskaner.service.mapper;

import com.tiskel.linkedinskaner.domain.Campaign;
import com.tiskel.linkedinskaner.domain.Leader;
import com.tiskel.linkedinskaner.domain.Profile;
import com.tiskel.linkedinskaner.service.dto.CampaignDTO;
import com.tiskel.linkedinskaner.service.dto.LeaderDTO;
import com.tiskel.linkedinskaner.service.dto.ProfileDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Profile} and its DTO {@link ProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper extends EntityMapper<ProfileDTO, Profile> {
    @Mapping(target = "leader", source = "leader", qualifiedByName = "leaderId")
    @Mapping(target = "comapigns", source = "comapigns", qualifiedByName = "campaignIdSet")
    ProfileDTO toDto(Profile s);

    @Mapping(target = "removeComapign", ignore = true)
    Profile toEntity(ProfileDTO profileDTO);

    @Named("leaderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LeaderDTO toDtoLeaderId(Leader leader);

    @Named("campaignId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CampaignDTO toDtoCampaignId(Campaign campaign);

    @Named("campaignIdSet")
    default Set<CampaignDTO> toDtoCampaignIdSet(Set<Campaign> campaign) {
        return campaign.stream().map(this::toDtoCampaignId).collect(Collectors.toSet());
    }
}
