<?php
$cap = new CheezCap( array(
  new CheezCapGroup( 'General', 'strollerGeneral', array(
    new CheezCapTextOption( 'Site Credits', 'Pretty please don\'t remove this :)', 'site_credits', null, true )
  ) ),
  /**
   * key naming convention:
   *
   * ad_SECTION_SIDE_SIZE
   *
   */
  new CheezCapGroup( 'Ad Manager', 'strollerAdManager', array(
      new CheezCapTextOption( 'HP ATF 300x145', 'Subscriber Favorites micro ad', 'ad_hp_atf_300x145', null, true ),
      new CheezCapTextOption( 'HP ATF 300x250', 'Overridden by 300x600', 'ad_hp_atf_300x250', null, true ),
      new CheezCapTextOption( 'HP ATF 300x600', 'Overrides 300x250', 'ad_hp_atf_300x600', null, true ),
      new CheezCapTextOption( 'HP ATF 728x90', 'Directly above main content', 'ad_hp_atf_728x90', null, true ),

      new CheezCapTextOption( 'City ATF 300x145', 'Subscriber Favorites micro ad; Overriden by 300x320', 'ad_ci_atf_300x145', null, true ),
      new CheezCapTextOption( 'City ATF 300x320', 'Overrides 300x145; Overridden by 300x600', 'ad_ci_atf_300x320', null, true ),
      new CheezCapTextOption( 'City ATF 300x600', 'Overrides 300x250', 'ad_ci_atf_300x600', null, true ),
      new CheezCapTextOption( 'City ATF 728x90', 'Directly above main content', 'ad_ci_atf_728x90', null, true ),

      new CheezCapTextOption( 'Single ATF 300x145', 'Subscriber Favorites micro ad; Overriden by 300x320', 'ad_sg_atf_300x145', null, true ),
      new CheezCapTextOption( 'Single ATF 300x320', 'Left sidebar; Overriden by 300x600', 'ad_sg_atf_300x320', null, true ),
      new CheezCapTextOption( 'Single ATF 300x600', 'Overrides 300x320', 'ad_sg_atf_300x600', null, true ),
      new CheezCapTextOption( 'Single ATF 728x90', 'Directly above main content', 'ad_sg_atf_728x90', null, true ),

      new CheezCapTextOption( 'New Baby Checklist ATF 300x250', 'Bathing', 'ad_chk1_atf_300x250', null, true ),
      new CheezCapTextOption( 'New Baby Checklist ATF 300x250', 'Diapering', 'ad_chk2_atf_300x250', null, true ),
      new CheezCapTextOption( 'New Baby Checklist ATF 300x250', 'Feeding', 'ad_chk3_atf_300x250', null, true ),
      new CheezCapTextOption( 'New Baby Checklist ATF 300x250', 'Gear & Equip', 'ad_chk4_atf_300x250', null, true ),
      new CheezCapTextOption( 'New Baby Checklist ATF 300x250', 'Sleeping', 'ad_chk5_atf_300x250', null, true ),

      new CheezCapTextOption( 'Scoopdaily ATF 300x250', '', 'ad_sd_atf_300x250', null, true ),

      new CheezCapTextOption( 'SUPER ATF 728x90', 'Very top of all pages', 'ad_super_atf_728x90', null, true ),
      new CheezCapTextOption( 'SUPER BTF 728x90', 'Footer, above menu', 'ad_super_btf_728x90', null, true ),
    ) ),
  new CheezCapGroup( 'Views', 'strollerViews', array() ),

  // this needs to be changed... maybe find some way to make this global. only shows on HP.
  new CheezCapGroup( 'Overrides - Homepage', 'strollerOverridesHome', array(
      new CheezCapTextOption( 'Featured Scoop / Post ID', 'Ex. 325; Leave blank for default action.', 'override_hp_featscoop', '' ),
    ) ),
) );