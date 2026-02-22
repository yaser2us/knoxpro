-- gathercare_wecare.AB definition

CREATE TABLE `AB` (
  `id` bigint unsigned NOT NULL,
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `commission_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` int NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFee_Atome` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `cbl_type` int NOT NULL DEFAULT '1',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL,
  `trial_period` int unsigned NOT NULL DEFAULT '0',
  `trial_period_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'day',
  `total_year` int NOT NULL,
  `free_carepoint` int NOT NULL,
  `initial_package_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.APISetting definition

CREATE TABLE `APISetting` (
  `APISettingID` int NOT NULL AUTO_INCREMENT,
  `APIKey` varchar(20) NOT NULL,
  `Signature` varchar(10) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`APISettingID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.A_birthday definition

CREATE TABLE `A_birthday` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `birthday` date NOT NULL,
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `age` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.AllCarers definition

CREATE TABLE `AllCarers` (
  `CarerName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NRIC` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ApplicantName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `PhoneNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `packageCode` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `DepositBalance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `Language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `CreatedDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `JoinDate` timestamp NULL DEFAULT NULL,
  `ActivationDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.App_ReferralCode definition

CREATE TABLE `App_ReferralCode` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `countActive` bigint DEFAULT NULL,
  `CountEverActive` int NOT NULL,
  `ActiveHvReferralCode` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.ApplicantsType definition

CREATE TABLE `ApplicantsType` (
  `ApplicantsTypeID` int NOT NULL AUTO_INCREMENT,
  `ApplicantsType` varchar(10) NOT NULL,
  `NewComerIncentive` decimal(9,2) NOT NULL,
  PRIMARY KEY (`ApplicantsTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.BB definition

CREATE TABLE `BB` (
  `noid` int NOT NULL AUTO_INCREMENT,
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `upline_id` int NOT NULL DEFAULT '4015',
  PRIMARY KEY (`noid`)
) ENGINE=InnoDB AUTO_INCREMENT=948 DEFAULT CHARSET=latin1;


-- gathercare_wecare.B_CBL definition

CREATE TABLE `B_CBL` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `qty` int NOT NULL,
  `qty2` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.CBL_application definition

CREATE TABLE `CBL_application` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(35) NOT NULL,
  `applicant_id` int NOT NULL,
  `cbl_id` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL,
  `sign_on` datetime NOT NULL,
  `status_id` int NOT NULL DEFAULT '0' COMMENT '0-pending; 1-approve; 2-reject; 3-review',
  `remarks` varchar(5000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=227 DEFAULT CHARSET=latin1;


-- gathercare_wecare.CS_748 definition

CREATE TABLE `CS_748` (
  `reference_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` bigint unsigned DEFAULT '0',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `birthday` date,
  `admission_date` date DEFAULT NULL,
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.CS_Age definition

CREATE TABLE `CS_Age` (
  `crowd_share_id` int unsigned DEFAULT NULL,
  `period_from` timestamp NULL DEFAULT NULL,
  `period_to` timestamp NULL DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sharing_cost_total` decimal(32,2) DEFAULT NULL,
  `insurant_count` decimal(32,0) DEFAULT NULL,
  `sharing_cost_each` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.CallbackPayment_20230526 definition

CREATE TABLE `CallbackPayment_20230526` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) NOT NULL,
  `referancesno` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1608 DEFAULT CHARSET=latin1;


-- gathercare_wecare.CallbackPayment_20230526_00 definition

CREATE TABLE `CallbackPayment_20230526_00` (
  `id` int NOT NULL DEFAULT '0',
  `uuid` varchar(50) NOT NULL,
  `referancesno` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.Commission definition

CREATE TABLE `Commission` (
  `CommissionID` int NOT NULL AUTO_INCREMENT,
  `CommissionType` varchar(50) NOT NULL DEFAULT 'share_task',
  `insurant_package_id` int NOT NULL,
  `insurant_id` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL,
  `CommissionDate` date NOT NULL,
  `SharerID` int NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `Level` int NOT NULL,
  `CommRate` decimal(18,2) NOT NULL,
  `NoSubc` int NOT NULL,
  `SharerStatus` int NOT NULL COMMENT '0-active, 1-inactive',
  `NoShared` int NOT NULL,
  `GeneratedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`CommissionID`)
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=latin1;


-- gathercare_wecare.CommissionRule definition

CREATE TABLE `CommissionRule` (
  `CommissionRuleID` int NOT NULL AUTO_INCREMENT,
  `LevelCommission` int NOT NULL,
  `Commission` decimal(18,2) NOT NULL,
  `MaxCommission` decimal(18,2) NOT NULL,
  `MemberSharer` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0',
  `blnFull` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`CommissionRuleID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;


-- gathercare_wecare.CronjobDate definition

CREATE TABLE `CronjobDate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CronjobDate` datetime NOT NULL,
  `ScriptLink` varchar(500) NOT NULL,
  `Batch_No` int NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3194 DEFAULT CHARSET=latin1;


-- gathercare_wecare.DailyFlowData definition

CREATE TABLE `DailyFlowData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_at` date NOT NULL,
  `status_id` int NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `count_insurant` int NOT NULL,
  `deposit_balance` decimal(18,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4963 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Department definition

CREATE TABLE `Department` (
  `DepartmentID` int NOT NULL AUTO_INCREMENT,
  `Department` varchar(50) NOT NULL,
  `MenuAccess` varchar(200) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `CreatedBy` int NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`DepartmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;


-- gathercare_wecare.EnquiryType definition

CREATE TABLE `EnquiryType` (
  `EnquiryTypeID` int NOT NULL AUTO_INCREMENT,
  `EnquiryType` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `PrefixCode` varchar(5) NOT NULL,
  `SeqNo` int NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`EnquiryTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


-- gathercare_wecare.FacebookSetting definition

CREATE TABLE `FacebookSetting` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `PageID` varchar(5000) NOT NULL,
  `AppID` varchar(5000) NOT NULL,
  `Token` varchar(50000) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.GCSetting definition

CREATE TABLE `GCSetting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Year` int NOT NULL,
  `GatewayMDR` decimal(8,2) NOT NULL,
  `CutOffDate` date NOT NULL,
  `CutOffCommissionSubcribeDate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.IHP definition

CREATE TABLE `IHP` (
  `NRIC` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `StaffID` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `Name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CoyID` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `SchemeID` bigint unsigned NOT NULL DEFAULT '4',
  `CostCenterID` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `DivisionID` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `DeptID` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `MemberID` bigint unsigned NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `first_activation_date` timestamp NULL DEFAULT NULL,
  `JoinDt` timestamp NOT NULL,
  `ResignDt` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `DOB` date NOT NULL,
  `Gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Relation` varchar(5) NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `BankBranchCD` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `BankAcctNo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Remarks` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `MARITAL_STATUS` varchar(50) NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'MY',
  `MobileNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.Income definition

CREATE TABLE `Income` (
  `IncomeID` int NOT NULL AUTO_INCREMENT,
  `Income` varchar(50) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  `Rank` int NOT NULL,
  PRIMARY KEY (`IncomeID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Job definition

CREATE TABLE `Job` (
  `JobID` int NOT NULL AUTO_INCREMENT,
  `JobField` varchar(500) NOT NULL,
  PRIMARY KEY (`JobID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;


-- gathercare_wecare.JobScope definition

CREATE TABLE `JobScope` (
  `JobScopeID` int NOT NULL AUTO_INCREMENT,
  `JobID` int NOT NULL,
  `JobScope` varchar(500) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  `Rank` int NOT NULL,
  PRIMARY KEY (`JobScopeID`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Leader_b4_20230626 definition

CREATE TABLE `Leader_b4_20230626` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.MC definition

CREATE TABLE `MC` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `reference_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `hospital` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `admission_time` time DEFAULT NULL,
  `discharged_date` date DEFAULT NULL,
  `issued_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guarantee_amount` decimal(8,2) DEFAULT NULL,
  `crowdshare_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.MC_noCarerID definition

CREATE TABLE `MC_noCarerID` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hospital_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned DEFAULT NULL,
  `patient_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `admission_time` time DEFAULT NULL,
  `discharged_date` date DEFAULT NULL,
  `issued_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guarantee_amount` decimal(8,2) DEFAULT NULL,
  `extra_amount` decimal(8,2) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Created',
  `crowd_share_id` bigint unsigned DEFAULT NULL,
  `old_case_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  `approval_on` datetime DEFAULT NULL,
  `approval_by` int NOT NULL,
  `remarks` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bln_penalty` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.MediaChannel definition

CREATE TABLE `MediaChannel` (
  `MediaChannelID` int NOT NULL AUTO_INCREMENT,
  `Channel` varchar(100) NOT NULL,
  `Rank` int NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`MediaChannelID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Menu definition

CREATE TABLE `Menu` (
  `MenuID` int NOT NULL AUTO_INCREMENT,
  `Menu` varchar(50) NOT NULL,
  `MenuPath` varchar(100) NOT NULL,
  `IconMenu` varchar(50) NOT NULL,
  `Ranking` int NOT NULL,
  `CurrentMenu` varchar(50) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`MenuID`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;


-- gathercare_wecare.More50Percent_20230523 definition

CREATE TABLE `More50Percent_20230523` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `insurant_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SharingDeposit` decimal(18,2) DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `appemail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apphone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `appname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `blnUnsettlementDeposit` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.Nationality definition

CREATE TABLE `Nationality` (
  `NationalityID` int NOT NULL AUTO_INCREMENT,
  `Nationality` varchar(100) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`NationalityID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


-- gathercare_wecare.OM_carer definition

CREATE TABLE `OM_carer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `insurant_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Program definition

CREATE TABLE `Program` (
  `ProgramID` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `Title` varchar(1000) NOT NULL,
  `AgeFrom` int NOT NULL,
  `AgeTo` int NOT NULL,
  `Description` longtext NOT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `AnnualFeeDescription` varchar(1000) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `SharingDepositDescription` varchar(1000) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFeeDescription` varchar(1000) NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ProgramID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.Razer_Payments definition

CREATE TABLE `Razer_Payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trx_id` varchar(50) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1130 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Razer_Payments_ChargeBack definition

CREATE TABLE `Razer_Payments_ChargeBack` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trx_id` varchar(50) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Razer_Payments_Refunding definition

CREATE TABLE `Razer_Payments_Refunding` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trx_id` varchar(50) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Relation definition

CREATE TABLE `Relation` (
  `relation_with_applicant` int NOT NULL AUTO_INCREMENT,
  `relation` varchar(100) NOT NULL,
  `relationtype` varchar(20) NOT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0',
  `Rank` int NOT NULL,
  `LimitQty` int NOT NULL,
  `LimitAge` int NOT NULL,
  PRIMARY KEY (`relation_with_applicant`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SMSDetails definition

CREATE TABLE `SMSDetails` (
  `SMSDetailsID` bigint NOT NULL AUTO_INCREMENT,
  `SMSListID` bigint NOT NULL,
  `Results` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `applicant_id` int NOT NULL,
  `MobileNo` varchar(50) DEFAULT NULL,
  `ReturnCode` int NOT NULL,
  `SMSDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Message` varchar(1000) NOT NULL,
  PRIMARY KEY (`SMSDetailsID`),
  KEY `SMSListID` (`SMSListID`)
) ENGINE=InnoDB AUTO_INCREMENT=23148 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SMSDetails_Carer definition

CREATE TABLE `SMSDetails_Carer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SMSListID` int NOT NULL,
  `insurant_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30306 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SMSList definition

CREATE TABLE `SMSList` (
  `SMSListID` bigint NOT NULL AUTO_INCREMENT,
  `SMSDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `SMSType` varchar(50) NOT NULL,
  `applicant_status_id` int NOT NULL,
  `SentBy` int NOT NULL,
  `SendOn` datetime NOT NULL,
  PRIMARY KEY (`SMSListID`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SMSResults definition

CREATE TABLE `SMSResults` (
  `Result` varchar(5) NOT NULL,
  `Description` varchar(40) NOT NULL,
  KEY `Result` (`Result`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.SMSSetting definition

CREATE TABLE `SMSSetting` (
  `SMSSettingID` int NOT NULL AUTO_INCREMENT,
  `SenderName` varchar(50) NOT NULL,
  `APIusername` varchar(100) NOT NULL,
  `APIpassword` varchar(100) NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SMSSettingID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SMSTemplate definition

CREATE TABLE `SMSTemplate` (
  `SMSTemplateID` int NOT NULL AUTO_INCREMENT,
  `applicant_status_id` int NOT NULL,
  `TemplateName` varchar(50) NOT NULL,
  `Message_en` varchar(1000) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Message_cn` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Message_bm` varchar(1000) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`SMSTemplateID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Sharer2 definition

CREATE TABLE `Sharer2` (
  `SharerID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `ContactNo` varchar(30) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `Images` varchar(100) NOT NULL,
  `OriImages` varchar(100) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  `CreatedOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SharerID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SharingTask definition

CREATE TABLE `SharingTask` (
  `SharingTaskID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(1000) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `TaskLink` varchar(1000) NOT NULL,
  `TaskGroup` int NOT NULL COMMENT '0-all;1-level; 2-age',
  `StartGroup` int NOT NULL,
  `EndGroup` int NOT NULL,
  `Description` varchar(10000) NOT NULL,
  `MediaFileLoc` varchar(1000) NOT NULL,
  `CreatedBy` int NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`SharingTaskID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.State definition

CREATE TABLE `State` (
  `StateID` int NOT NULL AUTO_INCREMENT,
  `State` varchar(100) NOT NULL,
  PRIMARY KEY (`StateID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;


-- gathercare_wecare.SubMenu definition

CREATE TABLE `SubMenu` (
  `SubMenuID` int NOT NULL AUTO_INCREMENT,
  `MenuID` int NOT NULL,
  `SubMenu` varchar(50) NOT NULL,
  `IconSubMenu` varchar(100) NOT NULL,
  `SubMenuPath` varchar(100) NOT NULL,
  `Ranking` int NOT NULL,
  `CurrentSubMenu` varchar(50) NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`SubMenuID`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=latin1;


-- gathercare_wecare.Subscription definition

CREATE TABLE `Subscription` (
  `SubscriptionID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL,
  `PaidAmount` decimal(18,2) NOT NULL,
  `PackageName` varchar(500) NOT NULL,
  `PackageValue` decimal(18,2) NOT NULL,
  `SubscribedDate` date NOT NULL,
  PRIMARY KEY (`SubscriptionID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


-- gathercare_wecare.TaskShared definition

CREATE TABLE `TaskShared` (
  `TaskSharedID` int NOT NULL AUTO_INCREMENT,
  `SharingTaskID` int NOT NULL,
  `SharerID` int NOT NULL,
  `SharedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TaskSharedID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.`User` definition

CREATE TABLE `User` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Gender` varchar(1) NOT NULL,
  `ContactNo` varchar(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Images` varchar(100) NOT NULL,
  `OriImages` varchar(100) NOT NULL,
  `DepartmentID` int NOT NULL,
  `JoinedDate` date NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedBy` int NOT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;


-- gathercare_wecare.UserPrivilege definition

CREATE TABLE `UserPrivilege` (
  `UserPrivilegeID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `MenuID` int NOT NULL,
  `SubMenuID` int NOT NULL,
  `blnAdd` int NOT NULL DEFAULT '0',
  `blnEdit` int NOT NULL DEFAULT '0',
  `blnDelete` int NOT NULL DEFAULT '0',
  `blnPrint` int NOT NULL DEFAULT '0',
  `blnApproval` int NOT NULL DEFAULT '0',
  `blnPublish` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserPrivilegeID`)
) ENGINE=InnoDB AUTO_INCREMENT=2144 DEFAULT CHARSET=latin1;


-- gathercare_wecare.a_insurant20240513 definition

CREATE TABLE `a_insurant20240513` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.access_log definition

CREATE TABLE `access_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` int NOT NULL,
  `ip_address` varchar(500) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `device` varchar(100) NOT NULL,
  `access_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `applicant_id` (`applicant_id`),
  KEY `country` (`country`,`city`)
) ENGINE=InnoDB AUTO_INCREMENT=92391 DEFAULT CHARSET=latin1;


-- gathercare_wecare.active_applicant definition

CREATE TABLE `active_applicant` (
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.active_carer definition

CREATE TABLE `active_carer` (
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `first_payment_date` date NOT NULL,
  `pending_annualfee` date DEFAULT NULL,
  `last_payment_type` int NOT NULL,
  `last_payment_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.addresses definition

CREATE TABLE `addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `unit_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MY',
  `owner_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16330 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.agencies definition

CREATE TABLE `agencies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint unsigned NOT NULL DEFAULT '1',
  `registration_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commission_amount` decimal(8,2) NOT NULL,
  `telegram_channel_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agencies_name_unique` (`name`),
  UNIQUE KEY `agencies_company_id_unique` (`company_id`),
  UNIQUE KEY `agencies_email_unique` (`email`),
  UNIQUE KEY `agencies_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.agency_comm definition

CREATE TABLE `agency_comm` (
  `agency_id` bigint unsigned DEFAULT '0',
  `agency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned DEFAULT '0',
  `applicant` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sumAmount` decimal(30,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.agency_users definition

CREATE TABLE `agency_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_login_at` datetime NOT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agency_users_email_unique` (`email`),
  KEY `agency_users_agency_id_foreign` (`agency_id`),
  KEY `agency_users_name_index` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.agent_statuses definition

CREATE TABLE `agent_statuses` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.agentcarer_20230425 definition

CREATE TABLE `agentcarer_20230425` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activeCarer` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.agreements definition

CREATE TABLE `agreements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `contents` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `is_active` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;


-- gathercare_wecare.agreements_tick definition

CREATE TABLE `agreements_tick` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` int NOT NULL,
  `b2b_company_id` int NOT NULL,
  `b2b_company_staff_id` int NOT NULL,
  `agreement_id` int NOT NULL,
  `tick_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7084 DEFAULT CHARSET=latin1;


-- gathercare_wecare.allow_abl_application definition

CREATE TABLE `allow_abl_application` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.announcements definition

CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(100) DEFAULT NULL,
  `content` mediumtext NOT NULL,
  `lang` varchar(2) DEFAULT 'en',
  `schedule_time` datetime NOT NULL,
  `response_compulsory` tinyint(1) DEFAULT '0',
  `created_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;


-- gathercare_wecare.app_pendingtopup definition

CREATE TABLE `app_pendingtopup` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.appeal_150 definition

CREATE TABLE `appeal_150` (
  `id` int NOT NULL AUTO_INCREMENT,
  `insurant_id` int NOT NULL,
  `date_start` date NOT NULL,
  `duration_day` int NOT NULL,
  `date_end` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reason` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant360 definition

CREATE TABLE `applicant360` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_active definition

CREATE TABLE `applicant_active` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_agent_history definition

CREATE TABLE `applicant_agent_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` int NOT NULL,
  `agency_id` int NOT NULL,
  `upline_type` varchar(100) NOT NULL,
  `upline_id` int NOT NULL,
  `clear_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2522 DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_all definition

CREATE TABLE `applicant_all` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_bm definition

CREATE TABLE `applicant_bm` (
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_bmencn definition

CREATE TABLE `applicant_bmencn` (
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_cards definition

CREATE TABLE `applicant_cards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ccbrand` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_issuer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cctype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `insurant_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `TokenInfo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_cards_applicant_id_foreign` (`applicant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10704 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.applicant_failed definition

CREATE TABLE `applicant_failed` (
  `Carer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `meta` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_frozen definition

CREATE TABLE `applicant_frozen` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_frozen_annualFee definition

CREATE TABLE `applicant_frozen_annualFee` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_pendingAF definition

CREATE TABLE `applicant_pendingAF` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_pendingtopup definition

CREATE TABLE `applicant_pendingtopup` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_refcode definition

CREATE TABLE `applicant_refcode` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_tie` int NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `total_carer` int NOT NULL,
  `active` int NOT NULL,
  `no_active` int NOT NULL,
  `hv_refcode` int NOT NULL,
  `new_refCode` varchar(20) NOT NULL,
  `new_id` int NOT NULL,
  `new_type` int NOT NULL,
  `type` varchar(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_status definition

CREATE TABLE `applicant_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_status_name` varchar(100) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `status_condition` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_token definition

CREATE TABLE `applicant_token` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicant_withdrawal definition

CREATE TABLE `applicant_withdrawal` (
  `applicant_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ApplicantsTypeID` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicants definition

CREATE TABLE `applicants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `is_tie` int NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date DEFAULT NULL,
  `ABLCode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ABLCode_AddedOn` date DEFAULT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `applicants_phone_number_unique` (`phone_number`),
  UNIQUE KEY `applicants_uuid_unique` (`uuid`),
  KEY `applicants_old_member_id_index` (`old_member_id`),
  KEY `applicants_upline_type_upline_id_index` (`upline_type`,`upline_id`),
  KEY `applicants_phone_number_index` (`phone_number`),
  KEY `applicants_agency_id_foreign` (`agency_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14792 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.applicants_20230509 definition

CREATE TABLE `applicants_20230509` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicants_20230731 definition

CREATE TABLE `applicants_20230731` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicants_20250326_1205 definition

CREATE TABLE `applicants_20250326_1205` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `is_tie` int NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `ABLCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ABLCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `applicants_phone_number_unique` (`phone_number`),
  UNIQUE KEY `applicants_uuid_unique` (`uuid`),
  KEY `applicants_old_member_id_index` (`old_member_id`),
  KEY `applicants_upline_type_upline_id_index` (`upline_type`,`upline_id`),
  KEY `applicants_phone_number_index` (`phone_number`),
  KEY `applicants_agency_id_foreign` (`agency_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14370 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.applicants_20250502 definition

CREATE TABLE `applicants_20250502` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `is_tie` int NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `ABLCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ABLCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.applicants_resetpassword definition

CREATE TABLE `applicants_resetpassword` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `is_tie` int NOT NULL DEFAULT '0',
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `ABLCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ABLCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.attachment_types definition

CREATE TABLE `attachment_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'public',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;


-- gathercare_wecare.attachments_feedback_temp definition

CREATE TABLE `attachments_feedback_temp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachment_type_id` int NOT NULL,
  `enquiry_id` int unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `cmp` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1638 DEFAULT CHARSET=latin1;


-- gathercare_wecare.attachments_temp definition

CREATE TABLE `attachments_temp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachment_type_id` int unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `cmp` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1108 DEFAULT CHARSET=latin1;


-- gathercare_wecare.auto_insurance_orders definition

CREATE TABLE `auto_insurance_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `car_plate_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_roadtax_renew_required` tinyint(1) NOT NULL,
  `full_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vouchers_claimed` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auto_insurance_orders_created_at_index` (`created_at`),
  KEY `auto_insurance_orders_updated_at_index` (`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=526 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.b2b_company definition

CREATE TABLE `b2b_company` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `raw_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referral_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


-- gathercare_wecare.b2b_company_staff definition

CREATE TABLE `b2b_company_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `b2b_company_id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `Images` varchar(500) NOT NULL,
  `OriImages` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


-- gathercare_wecare.bank_profiles definition

CREATE TABLE `bank_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_account` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `owner_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bank_profiles_uuid_unique` (`uuid`),
  KEY `bank_profiles_owner_type_owner_id_index` (`owner_type`,`owner_id`),
  KEY `bank_profiles_owner_name_index` (`owner_name`),
  KEY `bank_profiles_bank_name_index` (`bank_name`),
  KEY `bank_profiles_bank_account_index` (`bank_account`),
  KEY `bank_profiles_is_active_index` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=7713 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.batch_1 definition

CREATE TABLE `batch_1` (
  `id` int NOT NULL DEFAULT '0',
  `insurant_id` int NOT NULL,
  `insurant_name` varchar(150) NOT NULL,
  `insurant_nric` varchar(15) NOT NULL,
  `applicant_id` int NOT NULL,
  `applicant_name` varchar(150) NOT NULL,
  `applicant_contact` varchar(20) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `deposit_balance` decimal(18,2) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `nett_amount` decimal(18,2) NOT NULL,
  `batch_no` int NOT NULL,
  `status` int NOT NULL DEFAULT '0',
  `reason` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.beneficiaries definition

CREATE TABLE `beneficiaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `nric` varchar(20) NOT NULL,
  `relationship` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `target_type` varchar(50) NOT NULL,
  `target_id` int NOT NULL,
  `locked_until` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=782 DEFAULT CHARSET=latin1;


-- gathercare_wecare.bonus_commission_levels definition

CREATE TABLE `bonus_commission_levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level_code` varchar(255) DEFAULT NULL,
  `min_referrals` int DEFAULT NULL,
  `max_referrals` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


-- gathercare_wecare.carepoint_balances definition

CREATE TABLE `carepoint_balances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `care_point_type` int NOT NULL DEFAULT '0' COMMENT '0-new subscribe, 1-voucher',
  `target_type` varchar(255) NOT NULL,
  `target_id` int NOT NULL,
  `balance` decimal(8,2) NOT NULL,
  `validity_date` date NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=451 DEFAULT CHARSET=latin1;


-- gathercare_wecare.carepoint_topup definition

CREATE TABLE `carepoint_topup` (
  `id0` int NOT NULL AUTO_INCREMENT,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `insurant_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SharingDeposit` decimal(18,2),
  `applicant_id` bigint unsigned DEFAULT NULL,
  `status_id` int unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id0`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;


-- gathercare_wecare.carepoint_tx definition

CREATE TABLE `carepoint_tx` (
  `id` int NOT NULL AUTO_INCREMENT,
  `target_type` varchar(255) NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `target_id` int NOT NULL,
  `carepoint_balances_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `payment_id` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2216 DEFAULT CHARSET=latin1;


-- gathercare_wecare.carer_active_cn definition

CREATE TABLE `carer_active_cn` (
  `applicant` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `carer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.carer_reactivate_20230924 definition

CREATE TABLE `carer_reactivate_20230924` (
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `SharingDeposit` decimal(18,2),
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.carer_success definition

CREATE TABLE `carer_success` (
  `Carer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.clinic_panels definition

CREATE TABLE `clinic_panels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ihp_id` varchar(50) NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `raw_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StateID` int NOT NULL,
  `latitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fax` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7336 DEFAULT CHARSET=latin1;


-- gathercare_wecare.clinic_panels_temp definition

CREATE TABLE `clinic_panels_temp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ihp_id` varchar(50) NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `raw_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StateID` int NOT NULL,
  `latitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fax` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` int NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6799 DEFAULT CHARSET=latin1;


-- gathercare_wecare.commission_payouts definition

CREATE TABLE `commission_payouts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_bank_profile_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `month` tinyint unsigned NOT NULL,
  `year` smallint unsigned NOT NULL,
  `agent_comm` decimal(18,2) NOT NULL DEFAULT '0.00',
  `intro_comm` decimal(18,2) NOT NULL DEFAULT '0.00',
  `cbl_comm` decimal(18,2) NOT NULL DEFAULT '0.00',
  `bonus_comm` decimal(18,2) DEFAULT '0.00',
  `new_comer_incentive` decimal(18,2) NOT NULL DEFAULT '0.00',
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `paid_at` timestamp NULL DEFAULT NULL,
  `paid_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hv_active_carer` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `commission_payouts_uuid_unique` (`uuid`),
  KEY `commission_payouts_sender_type_sender_id_index` (`sender_type`,`sender_id`),
  KEY `commission_payouts_receiver_type_receiver_id_index` (`receiver_type`,`receiver_id`),
  KEY `commission_payouts_month_year_index` (`month`,`year`),
  KEY `commission_payouts_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=74862 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.commission_payouts_20230416 definition

CREATE TABLE `commission_payouts_20230416` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_bank_profile_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `month` tinyint unsigned NOT NULL,
  `year` smallint unsigned NOT NULL,
  `agent_comm` decimal(18,2) NOT NULL,
  `intro_comm` decimal(18,2) NOT NULL,
  `cbl_comm` decimal(18,2) NOT NULL,
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hv_active_carer` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.commission_payouts_bck definition

CREATE TABLE `commission_payouts_bck` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_bank_profile_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `month` tinyint unsigned NOT NULL,
  `year` smallint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.commissions definition

CREATE TABLE `commissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_payment_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `commission_type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'agent_comm',
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `mlm_level` int unsigned DEFAULT NULL,
  `commission_level_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `payout_id` bigint unsigned DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `remarks` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commissions_uuid_unique` (`uuid`),
  KEY `commissions_source_payment_id_foreign` (`source_payment_id`),
  KEY `commissions_payout_id_foreign` (`payout_id`),
  KEY `commissions_commission_level_code_foreign` (`commission_level_code`),
  KEY `commissions_insurant_id_foreign` (`insurant_id`),
  KEY `commissions_is_valid_index` (`is_valid`),
  KEY `commissions_sender_type_sender_id_index` (`sender_type`,`sender_id`),
  KEY `commissions_receiver_type_receiver_id_index` (`receiver_type`,`receiver_id`),
  KEY `commissions_mlm_level_index` (`mlm_level`)
) ENGINE=InnoDB AUTO_INCREMENT=141692 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.commissions2 definition

CREATE TABLE `commissions2` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_payment_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `mlm_level` int unsigned DEFAULT NULL,
  `commission_level_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `payout_id` bigint unsigned DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `remarks` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1165 DEFAULT CHARSET=latin1;


-- gathercare_wecare.commissions_20230416 definition

CREATE TABLE `commissions_20230416` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_payment_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `commission_type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'agent_comm',
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `mlm_level` int unsigned DEFAULT NULL,
  `commission_level_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `payout_id` bigint unsigned DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `remarks` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.commissions_bck definition

CREATE TABLE `commissions_bck` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_payment_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `mlm_level` int unsigned DEFAULT NULL,
  `commission_level_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `payout_id` bigint unsigned DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `remarks` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.commissions_waive definition

CREATE TABLE `commissions_waive` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_payment_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `commission_type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'agent_comm',
  `sender_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` bigint unsigned DEFAULT NULL,
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `mlm_level` int unsigned DEFAULT NULL,
  `commission_level_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `payout_id` bigint unsigned DEFAULT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `remarks` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.count_down_types definition

CREATE TABLE `count_down_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `count_down_unit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `handler` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `count_down` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `count_down_types_name_index` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.count_downs definition

CREATE TABLE `count_downs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int unsigned NOT NULL,
  `suspended_type` int NOT NULL COMMENT '1-annualFee; 2-deposit',
  `count_downs_id` int NOT NULL,
  `payment_type` int NOT NULL,
  `target_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` bigint unsigned NOT NULL,
  `count_down` int DEFAULT NULL,
  `count_down_unit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `executed_at` datetime DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `count_downs_type_id_foreign` (`type_id`),
  KEY `count_downs_target_type_target_id_index` (`target_type`,`target_id`),
  KEY `count_downs_count_down_index` (`count_down`),
  KEY `count_downs_executed_at_index` (`executed_at`),
  KEY `count_downs_effective_date_index` (`effective_date`)
) ENGINE=InnoDB AUTO_INCREMENT=179030 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.count_downs_20230416 definition

CREATE TABLE `count_downs_20230416` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `type_id` int unsigned NOT NULL,
  `suspended_type` int NOT NULL COMMENT '1-annualFee; 2-deposit',
  `target_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` bigint unsigned NOT NULL,
  `count_down` int DEFAULT NULL,
  `count_down_unit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `executed_at` datetime DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.count_downs_20230526 definition

CREATE TABLE `count_downs_20230526` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `type_id` int unsigned NOT NULL,
  `suspended_type` int NOT NULL COMMENT '1-annualFee; 2-deposit',
  `target_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` bigint unsigned NOT NULL,
  `count_down` int DEFAULT NULL,
  `count_down_unit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `executed_at` datetime DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.count_downs_deleted_20230922 definition

CREATE TABLE `count_downs_deleted_20230922` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `type_id` int unsigned NOT NULL,
  `suspended_type` int NOT NULL COMMENT '1-annualFee; 2-deposit',
  `target_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` bigint unsigned NOT NULL,
  `count_down` int DEFAULT NULL,
  `count_down_unit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `executed_at` datetime DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.crowd_share_details definition

CREATE TABLE `crowd_share_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `insurant_package_id` bigint unsigned DEFAULT NULL,
  `insurant_package_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_package_weightage` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_package_weightage_total` decimal(8,2) unsigned DEFAULT NULL,
  `insurant_count` int unsigned NOT NULL DEFAULT '1',
  `sharing_cost_each` decimal(8,2) NOT NULL DEFAULT '0.00',
  `sharing_cost_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `crowd_share_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `crowd_share_details_created_at_index` (`created_at`),
  KEY `crowd_share_details_updated_at_index` (`updated_at`),
  KEY `crowd_share_details_insurant_package_id_foreign` (`insurant_package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12020 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.crowd_share_records definition

CREATE TABLE `crowd_share_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL,
  `insurant_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crowd_share_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `crowd_share_details_id` int unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `crowd_share_records_insurant_id_foreign` (`insurant_id`),
  KEY `crowd_share_records_crowd_share_id_foreign` (`crowd_share_id`)
) ENGINE=InnoDB AUTO_INCREMENT=348653 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.crowd_shares definition

CREATE TABLE `crowd_shares` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_from` timestamp NULL DEFAULT NULL,
  `period_to` timestamp NULL DEFAULT NULL,
  `total_required_amount` decimal(8,2) DEFAULT NULL,
  `case_required_amount` decimal(8,2) NOT NULL,
  `last_debt_amount` decimal(8,2) DEFAULT NULL,
  `last_extra_amount` decimal(8,2) DEFAULT NULL,
  `crowd_shared_amount` decimal(8,2) DEFAULT NULL,
  `extra_amount` decimal(8,2) DEFAULT NULL,
  `debt_amount` decimal(8,2) DEFAULT NULL,
  `non_smoker_count` bigint unsigned DEFAULT NULL,
  `smoker_count` bigint unsigned DEFAULT NULL,
  `non_smoker_charge` decimal(8,2) DEFAULT NULL,
  `smoker_charge` decimal(8,2) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_crowd_share_id` bigint DEFAULT NULL,
  `total_case` int NOT NULL,
  `total_carer` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `crowd_shares_uuid_unique` (`uuid`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.crowd_shares_BCK definition

CREATE TABLE `crowd_shares_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_from` timestamp NULL DEFAULT NULL,
  `period_to` timestamp NULL DEFAULT NULL,
  `total_required_amount` decimal(8,2) DEFAULT NULL,
  `case_required_amount` decimal(8,2) NOT NULL,
  `last_debt_amount` decimal(8,2) DEFAULT NULL,
  `last_extra_amount` decimal(8,2) DEFAULT NULL,
  `crowd_shared_amount` decimal(8,2) DEFAULT NULL,
  `extra_amount` decimal(8,2) DEFAULT NULL,
  `debt_amount` decimal(8,2) DEFAULT NULL,
  `non_smoker_count` bigint unsigned DEFAULT NULL,
  `smoker_count` bigint unsigned DEFAULT NULL,
  `non_smoker_charge` decimal(8,2) DEFAULT NULL,
  `smoker_charge` decimal(8,2) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_crowd_share_id` bigint DEFAULT NULL,
  `total_case` int NOT NULL,
  `total_carer` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `crowd_shares_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.device_tokens definition

CREATE TABLE `device_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `device_type` varchar(20) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `is_active` tinyint DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=667 DEFAULT CHARSET=latin1;


-- gathercare_wecare.email_setting definition

CREATE TABLE `email_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `api_key` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.enquiry definition

CREATE TABLE `enquiry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(40) NOT NULL,
  `enquiry_code` varchar(10) NOT NULL,
  `applicant_id` int NOT NULL,
  `insurant_id` int NOT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `contact_no` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `enquiry_type_id` int NOT NULL,
  `enquiry_description` varchar(10000) NOT NULL,
  `submit_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `followup_by` int DEFAULT '0',
  `start_followup` datetime DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `completed_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1980 DEFAULT CHARSET=latin1;


-- gathercare_wecare.enquiry_feedback definition

CREATE TABLE `enquiry_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enquiry_id` int NOT NULL,
  `feedback_owner` varchar(50) NOT NULL,
  `owner_id` int NOT NULL,
  `feedback_description` varchar(10000) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `submit_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5749 DEFAULT CHARSET=latin1;


-- gathercare_wecare.fail_o5 definition

CREATE TABLE `fail_o5` (
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `id` bigint unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.failed_jobs definition

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=318 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.faqs definition

CREATE TABLE `faqs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.file_uploads definition

CREATE TABLE `file_uploads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(191) DEFAULT NULL,
  `original_name` varchar(191) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `uploadable_type` varchar(100) DEFAULT NULL,
  `uploadable_id` bigint unsigned DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=316 DEFAULT CHARSET=latin1;


-- gathercare_wecare.frozen_closed definition

CREATE TABLE `frozen_closed` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.gather_cares definition

CREATE TABLE `gather_cares` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.hospital_panels definition

CREATE TABLE `hospital_panels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `emas_hospital_id` int NOT NULL,
  `ihp_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `raw_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StateID` int NOT NULL,
  `latitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fax` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_hospital_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` int NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `hospital_panels_uuid_unique` (`uuid`),
  KEY `hospital_panels_name_index` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=724 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.hospital_panels_temp definition

CREATE TABLE `hospital_panels_temp` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `emas_hospital_id` int NOT NULL,
  `ihp_id` varchar(50) NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `raw_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StateID` int NOT NULL,
  `latitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fax` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_hospital_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` int NOT NULL,
  `is_active` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurantFrozen definition

CREATE TABLE `insurantFrozen` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_20230704 definition

CREATE TABLE `insurant_20230704` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_20231227 definition

CREATE TABLE `insurant_20231227` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_active definition

CREATE TABLE `insurant_active` (
  `insurant_id` bigint unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_applicant_cards definition

CREATE TABLE `insurant_applicant_cards` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ccbrand` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_issuer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cctype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `TokenInfo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_balance_records definition

CREATE TABLE `insurant_balance_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned NOT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_balance_records_uuid_unique` (`uuid`),
  KEY `insurant_balance_records_insurant_id_foreign` (`insurant_id`),
  KEY `insurant_balance_records_source_type_source_id_index` (`source_type`,`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=353783 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_balance_records_20230328 definition

CREATE TABLE `insurant_balance_records_20230328` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned NOT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_balance_records_20230416 definition

CREATE TABLE `insurant_balance_records_20230416` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned NOT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_balance_records_20230420 definition

CREATE TABLE `insurant_balance_records_20230420` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned NOT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_balance_records_20240626 definition

CREATE TABLE `insurant_balance_records_20240626` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned NOT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_balance_records_adjust definition

CREATE TABLE `insurant_balance_records_adjust` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_id` bigint unsigned NOT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_benefit_levels definition

CREATE TABLE `insurant_benefit_levels` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Which is also level',
  `level` tinyint unsigned NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_benefits definition

CREATE TABLE `insurant_benefits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL,
  `item_id` smallint unsigned NOT NULL,
  `amount` bigint unsigned NOT NULL,
  `is_unlimited` int NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_benefits_insurant_id_item_id_unique` (`insurant_id`,`item_id`),
  KEY `insurant_benefits_item_id_foreign` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58563 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_benefits_bck definition

CREATE TABLE `insurant_benefits_bck` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `item_id` smallint unsigned NOT NULL,
  `amount` bigint unsigned NOT NULL,
  `is_unlimited` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_cards definition

CREATE TABLE `insurant_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(57) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccbrand` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_issuer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cctype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TokenInfo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20097 DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_cards_20230727 definition

CREATE TABLE `insurant_cards_20230727` (
  `id` int NOT NULL DEFAULT '0',
  `uuid` varchar(57) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `is_active` tinyint(1) DEFAULT '1',
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccbrand` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_issuer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cctype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TokenInfo` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_cards_bck definition

CREATE TABLE `insurant_cards_bck` (
  `id` int NOT NULL DEFAULT '0',
  `uuid` varchar(57) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `is_active` tinyint(1) DEFAULT '1',
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccbrand` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_issuer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cctype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TokenInfo` char(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_package_logs definition

CREATE TABLE `insurant_package_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `package_from` int NOT NULL,
  `package_to` int NOT NULL,
  `executed_at` timestamp NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `user_id` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1385 DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages definition

CREATE TABLE `insurant_packages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `commission_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFee_Atome` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `cbl_type` int NOT NULL DEFAULT '1',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL,
  `trial_period` int unsigned NOT NULL DEFAULT '0',
  `trial_period_unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'day',
  `total_year` int NOT NULL,
  `free_carepoint` int NOT NULL,
  `initial_package_id` int NOT NULL,
  `gv_introcomm` int NOT NULL DEFAULT '0' COMMENT '1-gv introcomm other than initial 1st payment',
  `is_normal` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `is_smoker` (`is_smoker`,`min_age`,`max_age`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=488 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_packages2 definition

CREATE TABLE `insurant_packages2` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages3 definition

CREATE TABLE `insurant_packages3` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_packagesNew definition

CREATE TABLE `insurant_packagesNew` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_150 definition

CREATE TABLE `insurant_packages_150` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_2 definition

CREATE TABLE `insurant_packages_2` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `commission_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` int NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFee_Atome` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL,
  `trial_period` int unsigned NOT NULL DEFAULT '0',
  `trial_period_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'day',
  `total_year` int NOT NULL,
  `free_carepoint` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_20230416 definition

CREATE TABLE `insurant_packages_20230416` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_20231008 definition

CREATE TABLE `insurant_packages_20231008` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_20250107 definition

CREATE TABLE `insurant_packages_20250107` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `commission_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` int NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFee_Atome` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL,
  `trial_period` int unsigned NOT NULL DEFAULT '0',
  `trial_period_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'day',
  `total_year` int NOT NULL,
  `free_carepoint` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_20250110 definition

CREATE TABLE `insurant_packages_20250110` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `commission_scheme_id` bigint unsigned NOT NULL DEFAULT '1',
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` int NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFee_Atome` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `cbl_type` int NOT NULL DEFAULT '1',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL,
  `trial_period` int unsigned NOT NULL DEFAULT '0',
  `trial_period_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'day',
  `total_year` int NOT NULL,
  `free_carepoint` int NOT NULL,
  `initial_package_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=457 DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_old definition

CREATE TABLE `insurant_packages_old` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_packages_token definition

CREATE TABLE `insurant_packages_token` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_refunding definition

CREATE TABLE `insurant_refunding` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_id` bigint unsigned DEFAULT NULL,
  `balance_id` bigint unsigned DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_statuses definition

CREATE TABLE `insurant_statuses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ranks` int NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `been_active_before` int NOT NULL,
  `claimable` tinyint(1) NOT NULL,
  `color` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `should_share` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_uuid definition

CREATE TABLE `insurant_uuid` (
  `insurant_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Insurant who failed the payment.'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230416 definition

CREATE TABLE `insurants_20230416` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230423 definition

CREATE TABLE `insurants_20230423` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230519 definition

CREATE TABLE `insurants_20230519` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230523 definition

CREATE TABLE `insurants_20230523` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230526 definition

CREATE TABLE `insurants_20230526` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230625 definition

CREATE TABLE `insurants_20230625` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230717 definition

CREATE TABLE `insurants_20230717` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230731 definition

CREATE TABLE `insurants_20230731` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20230824 definition

CREATE TABLE `insurants_20230824` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20231010 definition

CREATE TABLE `insurants_20231010` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20231031 definition

CREATE TABLE `insurants_20231031` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20240126 definition

CREATE TABLE `insurants_20240126` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20240226 definition

CREATE TABLE `insurants_20240226` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20240626 definition

CREATE TABLE `insurants_20240626` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `first_activation_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20250215 definition

CREATE TABLE `insurants_20250215` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `beneficiary_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiary_contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `first_activation_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_20250502 definition

CREATE TABLE `insurants_20250502` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `beneficiary_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiary_contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `first_activation_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurants_bck definition

CREATE TABLE `insurants_bck` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT 'table Relation',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL COMMENT 'table Nationality',
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL COMMENT '0-no, 1-yes',
  `jobscope` int NOT NULL,
  `income` int NOT NULL COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 , 5- >10000, 6 - Not Recognized',
  `marital` int NOT NULL COMMENT '1-single, 2-married, 3-divorced, 4-other',
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurants_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurants_deleted definition

CREATE TABLE `insurants_deleted` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.intro_token_balances definition

CREATE TABLE `intro_token_balances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `target_type` varchar(255) NOT NULL,
  `target_id` int NOT NULL,
  `balance` int NOT NULL,
  `progress` int DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4985 DEFAULT CHARSET=latin1;


-- gathercare_wecare.intro_token_tx definition

CREATE TABLE `intro_token_tx` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL COMMENT '1:Intro, 2:Redeem, 3:Debit, 4:Credit',
  `target_type` varchar(255) NOT NULL,
  `target_id` int NOT NULL,
  `source_type` varchar(255) NOT NULL,
  `source_id` int NOT NULL,
  `amount` int NOT NULL,
  `executed_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=latin1;


-- gathercare_wecare.ip definition

CREATE TABLE `ip` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_scheme_id` int NOT NULL DEFAULT '1',
  `commission_scheme_id` int NOT NULL DEFAULT '1',
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` int NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `TransactionFee_Atome` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `cbl_type` int NOT NULL DEFAULT '1',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `advance_package_price` decimal(18,2) NOT NULL,
  `trial_period` int NOT NULL,
  `trial_period_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'day',
  `total_year` int NOT NULL,
  `free_carepoint` int NOT NULL,
  `initial_package_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.jobs definition

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.knowledge_based definition

CREATE TABLE `knowledge_based` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ranks` int NOT NULL,
  `lang_type` varchar(2) NOT NULL,
  `question` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;


-- gathercare_wecare.knowledge_based_answers definition

CREATE TABLE `knowledge_based_answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `knowledge_based_id` int NOT NULL,
  `thumbnail_link` varchar(200) NOT NULL,
  `answer_link` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;


-- gathercare_wecare.landing_page_responses definition

CREATE TABLE `landing_page_responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `target` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;


-- gathercare_wecare.lang definition

CREATE TABLE `lang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `en` longtext NOT NULL,
  `cn` longtext NOT NULL,
  `bm` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=latin1;


-- gathercare_wecare.latest_refunding definition

CREATE TABLE `latest_refunding` (
  `applicant` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `carer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `SharingDeposit` decimal(18,2) DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `last_payment_date` datetime NOT NULL,
  `last_payment_type` int NOT NULL,
  `bln_FullPayment` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.lawyer_carer_details definition

CREATE TABLE `lawyer_carer_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carer_id` int NOT NULL,
  `carer_name` varchar(255) NOT NULL,
  `carer_nric` varchar(12) NOT NULL,
  `applicant_id` int NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `applicant_phone` varchar(15) DEFAULT NULL,
  `applicant_email` varchar(255) DEFAULT NULL,
  `preferred_language` varchar(2) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=473 DEFAULT CHARSET=latin1;


-- gathercare_wecare.marketing_announcement definition

CREATE TABLE `marketing_announcement` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ranks` int NOT NULL,
  `subject` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `wa_phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


-- gathercare_wecare.marketing_announcement_details definition

CREATE TABLE `marketing_announcement_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marketing_announcement_id` int NOT NULL,
  `details_link` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `ranks` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


-- gathercare_wecare.marketing_announcement_interest definition

CREATE TABLE `marketing_announcement_interest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marketing_announcement_id` int NOT NULL,
  `applicant_id` int NOT NULL,
  `is_interested` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


-- gathercare_wecare.medical_cases definition

CREATE TABLE `medical_cases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `claim_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `claim_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classification` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `treatment_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hospital_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned DEFAULT NULL,
  `patient_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `admission_time` time DEFAULT NULL,
  `discharged_date` date DEFAULT NULL,
  `issued_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `payment_deadline` date DEFAULT NULL,
  `is_cancer` tinyint(1) DEFAULT NULL,
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guarantee_amount` decimal(8,2) DEFAULT NULL,
  `extra_amount` decimal(8,2) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Created',
  `crowd_share_id` bigint unsigned DEFAULT NULL,
  `old_case_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  `approval_on` datetime DEFAULT NULL,
  `approval_by` int DEFAULT NULL,
  `remarks` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bln_penalty` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `medical_cases_uuid_unique` (`uuid`),
  KEY `medical_cases_hospital_id_foreign` (`hospital_id`),
  KEY `medical_cases_insurant_id_foreign` (`insurant_id`),
  KEY `medical_cases_crowd_share_id_foreign` (`crowd_share_id`),
  KEY `medical_cases_status_index` (`status`),
  KEY `status` (`status`,`is_active`),
  KEY `medical_cases_claim_number_index` (`claim_number`),
  KEY `medical_cases_invoice_date_index` (`invoice_date`),
  KEY `medical_cases_payment_deadline_index` (`payment_deadline`),
  KEY `medical_cases_is_cancer_index` (`is_cancer`)
) ENGINE=InnoDB AUTO_INCREMENT=1047 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.medical_cases_temp definition

CREATE TABLE `medical_cases_temp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hospital_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned DEFAULT NULL,
  `patient_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `admission_time` time DEFAULT NULL,
  `discharged_date` date DEFAULT NULL,
  `issued_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guarantee_amount` decimal(8,2) DEFAULT NULL,
  `extra_amount` decimal(8,2) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Created',
  `attachment` varchar(5000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98137 DEFAULT CHARSET=latin1;


-- gathercare_wecare.medical_profile_answers definition

CREATE TABLE `medical_profile_answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint unsigned NOT NULL,
  `medical_profile_id` bigint unsigned NOT NULL,
  `value` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medical_profile_answers_medical_profile_id_foreign` (`medical_profile_id`),
  KEY `medical_profile_answers_question_id_foreign` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=102998 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.medical_profile_answers_BCK definition

CREATE TABLE `medical_profile_answers_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint unsigned NOT NULL,
  `medical_profile_id` bigint unsigned NOT NULL,
  `value` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.medical_profile_questions definition

CREATE TABLE `medical_profile_questions` (
  `id` bigint unsigned NOT NULL,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_zh` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.medical_profiles_BCK definition

CREATE TABLE `medical_profiles_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.migrations definition

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.mission_coin_balances definition

CREATE TABLE `mission_coin_balances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `validity_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=390 DEFAULT CHARSET=latin1;


-- gathercare_wecare.mission_coin_transactions definition

CREATE TABLE `mission_coin_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `description` text,
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;


-- gathercare_wecare.mission_participations definition

CREATE TABLE `mission_participations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mission_id` bigint unsigned DEFAULT NULL,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `joined_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=latin1;


-- gathercare_wecare.mission_rewards definition

CREATE TABLE `mission_rewards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mission_participation_id` bigint unsigned DEFAULT NULL,
  `reward_type` varchar(255) DEFAULT NULL,
  `reward_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `transaction_reference` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;


-- gathercare_wecare.mission_submission_files definition

CREATE TABLE `mission_submission_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mission_submission_id` bigint unsigned DEFAULT NULL,
  `file_upload_id` bigint unsigned DEFAULT NULL,
  `sort_order` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;


-- gathercare_wecare.mission_submissions definition

CREATE TABLE `mission_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mission_participation_id` bigint unsigned DEFAULT NULL,
  `text_content` text,
  `meta_data` json DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `feedback` text,
  `reviewed_by` bigint unsigned DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;


-- gathercare_wecare.mission_types definition

CREATE TABLE `mission_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `validation_rules` json DEFAULT NULL,
  `configuration_schema` json DEFAULT NULL,
  `is_active` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


-- gathercare_wecare.missions definition

CREATE TABLE `missions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `mission_type_id` bigint unsigned DEFAULT NULL,
  `cover_image_id` bigint unsigned DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `difficulty_level` varchar(255) DEFAULT NULL,
  `published_by` bigint unsigned DEFAULT NULL,
  `configuration` json DEFAULT NULL,
  `reward_type` varchar(255) DEFAULT NULL,
  `reward_amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


-- gathercare_wecare.new_payment definition

CREATE TABLE `new_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `channel_reference_id` varchar(50) NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `insurant_id` int NOT NULL,
  `status` varchar(100) NOT NULL,
  `meta` varchar(5000) NOT NULL,
  `settle` int NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=latin1;


-- gathercare_wecare.new_payment_Fail definition

CREATE TABLE `new_payment_Fail` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `status_id` int unsigned NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.new_settlement definition

CREATE TABLE `new_settlement` (
  `id` int NOT NULL DEFAULT '0',
  `channel_reference_id` varchar(50) NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `bill_amt` decimal(18,2) NOT NULL,
  `actual_amt` decimal(18,2) NOT NULL,
  `fiuu_trx` decimal(18,2) NOT NULL,
  `system_amt` decimal(18,2) NOT NULL,
  `trx_amt` decimal(18,2) NOT NULL,
  `extra_trx` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.news_articles definition

CREATE TABLE `news_articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_image` text COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  `view_count` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `is_featured` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `gallery` json DEFAULT NULL,
  `translations` json DEFAULT NULL COMMENT 'JSON containing multilingual translations for title, content',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.noToken definition

CREATE TABLE `noToken` (
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.no_token definition

CREATE TABLE `no_token` (
  `carer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicant` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.noresponse_20230616 definition

CREATE TABLE `noresponse_20230616` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL,
  `last_balance` decimal(18,2) NOT NULL,
  `insurant_status` int NOT NULL,
  `insurant_uuid` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.notifications definition

CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_en` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_en` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_zh` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_zh` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_ms` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_ms` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `receiver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `receiver_id` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notifications_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.oauth_access_tokens definition

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `client_id` int unsigned NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.oauth_auth_codes definition

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `client_id` int unsigned NOT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.oauth_clients definition

CREATE TABLE `oauth_clients` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `redirect` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.oauth_refresh_tokens definition

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.oldapplicants definition

CREATE TABLE `oldapplicants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `agency_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.oldapplicants_xiong definition

CREATE TABLE `oldapplicants_xiong` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `agency_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.panic_button_records definition

CREATE TABLE `panic_button_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `target_type` varchar(255) NOT NULL,
  `target_id` int NOT NULL,
  `call_to_no` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1505 DEFAULT CHARSET=latin1;


-- gathercare_wecare.partner_product_order_statuses definition

CREATE TABLE `partner_product_order_statuses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status_code` int unsigned NOT NULL,
  `class` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.partners definition

CREATE TABLE `partners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `partners_name_unique` (`name`),
  UNIQUE KEY `partners_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payment_20230426 definition

CREATE TABLE `payment_20230426` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `new_uuid` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.payment_channel_types definition

CREATE TABLE `payment_channel_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `channel_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payment_logs_old definition

CREATE TABLE `payment_logs_old` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned DEFAULT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `razer_transaction_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not being used anymore. Refer to payment_id',
  `razer_transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not being used anymore. Refer to payment_id',
  `response_body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payment_logs_payment_id_foreign` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=139322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payment_noresponse definition

CREATE TABLE `payment_noresponse` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.payment_statuses definition

CREATE TABLE `payment_statuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payment_types definition

CREATE TABLE `payment_types` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payments definition

CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `Penalty` decimal(18,2) DEFAULT NULL,
  `Voucher` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `blnTopupFinal` int DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int NOT NULL,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `countdown_type_id` int NOT NULL,
  `razer_settlement_amount` decimal(18,2) NOT NULL,
  `razer_mdr` decimal(18,2) NOT NULL,
  `bln_upgradeplan` int NOT NULL DEFAULT '0',
  `bln_offline` int NOT NULL DEFAULT '0',
  `settlement_date` datetime DEFAULT NULL,
  `chargeback_payment_id` int NOT NULL,
  `BillingName` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BillingMobileNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BillingEmail` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Bin4` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Channel` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BankName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ServiceItem` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `b2b_company_id` int NOT NULL,
  `payment_gateway` int NOT NULL DEFAULT '0' COMMENT '0-fiuu; 1-atome',
  `insurant_package_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_uuid_unique` (`uuid`),
  KEY `payments_type_id_foreign` (`type_id`),
  KEY `payments_applicant_id_foreign` (`applicant_id`),
  KEY `payments_insurant_id_foreign` (`insurant_id`),
  KEY `payments_status_id_foreign` (`status_id`),
  KEY `payments_refund_target_id_foreign` (`refund_target_id`),
  KEY `payments_channel_reference_id_index` (`channel_reference_id`),
  KEY `applicant_id` (`applicant_id`),
  KEY `applicant_card_id` (`applicant_card_id`)
) ENGINE=InnoDB AUTO_INCREMENT=268248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payments_20240126 definition

CREATE TABLE `payments_20240126` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `Penalty` decimal(18,2) DEFAULT NULL,
  `Voucher` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `blnTopupFinal` int DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `countdown_type_id` int NOT NULL,
  `razer_settlement_amount` decimal(18,2) NOT NULL,
  `razer_mdr` decimal(18,2) NOT NULL,
  `bln_upgradeplan` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.payments_20240308 definition

CREATE TABLE `payments_20240308` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `Penalty` decimal(18,2) DEFAULT NULL,
  `Voucher` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `blnTopupFinal` int DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int NOT NULL,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `countdown_type_id` int NOT NULL,
  `razer_settlement_amount` decimal(18,2) NOT NULL,
  `razer_mdr` decimal(18,2) NOT NULL,
  `bln_upgradeplan` int NOT NULL DEFAULT '0',
  `bln_offline` int NOT NULL DEFAULT '0',
  `settlement_date` datetime NOT NULL,
  `chargeback_payment_id` int NOT NULL,
  `BillingName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `BillingMobileNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `BillingEmail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Bin4` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Channel` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `BankName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ServiceItem` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.payments_BCK definition

CREATE TABLE `payments_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_uuid_unique` (`uuid`),
  KEY `payments_type_id_foreign` (`type_id`),
  KEY `payments_applicant_id_foreign` (`applicant_id`),
  KEY `payments_insurant_id_foreign` (`insurant_id`),
  KEY `payments_status_id_foreign` (`status_id`),
  KEY `payments_refund_target_id_foreign` (`refund_target_id`),
  KEY `payments_channel_reference_id_index` (`channel_reference_id`),
  KEY `applicant_id` (`applicant_id`),
  KEY `applicant_card_id` (`applicant_card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payments_bck_20230426 definition

CREATE TABLE `payments_bck_20230426` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.payments_details definition

CREATE TABLE `payments_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) NOT NULL,
  `payment_id` int NOT NULL,
  `insurant_id` int NOT NULL,
  `b2b_company_id` int NOT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1;


-- gathercare_wecare.permissions definition

CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `action_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.personal_access_tokens definition

CREATE TABLE `personal_access_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) DEFAULT NULL,
  `tokenable_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `abilities` text,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3830 DEFAULT CHARSET=latin1;


-- gathercare_wecare.phone_verifications definition

CREATE TABLE `phone_verifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `eid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_info` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `effective_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `phone_verifications_eid_index` (`eid`),
  KEY `phone_verifications_phone_number_index` (`phone_number`),
  KEY `phone_verifications_session_info_index` (`session_info`)
) ENGINE=InnoDB AUTO_INCREMENT=24215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.preset_values definition

CREATE TABLE `preset_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;


-- gathercare_wecare.program_guidelines definition

CREATE TABLE `program_guidelines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `change_summary` mediumtext COLLATE utf8mb4_unicode_ci COMMENT 'Summary of changes from previous version',
  `pdffile` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lang_type` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  `version` int DEFAULT '1' COMMENT 'Version number of the guideline',
  `parent_id` bigint unsigned DEFAULT NULL COMMENT 'Reference to previous version',
  `published_at` timestamp NULL DEFAULT NULL COMMENT 'When this version was published',
  `effective_from` timestamp NULL DEFAULT NULL COMMENT 'When this version becomes effective',
  UNIQUE KEY `id` (`id`),
  KEY `idx_lang_active_effective` (`lang_type`,`is_active`,`effective_from`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_version` (`version`),
  KEY `idx_published_at` (`published_at`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.promotion_period_nobonus definition

CREATE TABLE `promotion_period_nobonus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.raya_insurant_packages definition

CREATE TABLE `raya_insurant_packages` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `initial_first_payment` decimal(8,2) NOT NULL,
  `initial_second_payment` decimal(8,2) NOT NULL,
  `recurring_first_payment` decimal(8,2) NOT NULL,
  `recurring_second_payment` decimal(8,2) NOT NULL,
  `package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_package_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upgrade_to_package` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_renew` int NOT NULL,
  `redeem_token_package` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `SharingDeposit` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `implemented_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crowd_share_ratio` decimal(8,2) DEFAULT NULL,
  `monthly_max_charge` decimal(8,2) DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `tokenize_payment` decimal(8,2) NOT NULL,
  `has_commission` tinyint(1) DEFAULT '0',
  `package_commission` decimal(18,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bln_subscribe` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advance_package_price` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.raya_promo2024 definition

CREATE TABLE `raya_promo2024` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `package_renew` int,
  `package_renew_id` bigint unsigned DEFAULT '0',
  `pay_intro` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.raya_promo2024_y2 definition

CREATE TABLE `raya_promo2024_y2` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `start_date` date NOT NULL,
  `upgrade_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.razer_chargeback definition

CREATE TABLE `razer_chargeback` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `Penalty` decimal(18,2) DEFAULT NULL,
  `Voucher` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `blnTopupFinal` int DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `countdown_type_id` int NOT NULL,
  `ApplicantName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `InsurantName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentStatus` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.razer_refunding definition

CREATE TABLE `razer_refunding` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `nett_amount` decimal(8,2) DEFAULT NULL,
  `AnnualFee` decimal(18,2) NOT NULL,
  `bln_FullPayment` int NOT NULL DEFAULT '0',
  `SharingDeposit` decimal(18,2) NOT NULL,
  `Penalty` decimal(18,2) DEFAULT NULL,
  `Voucher` decimal(18,2) NOT NULL,
  `TransactionFee` decimal(18,2) NOT NULL,
  `type_id` smallint unsigned NOT NULL,
  `blnTopupFinal` int DEFAULT '0',
  `insurant_id` bigint unsigned NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `applicant_card_id` bigint unsigned DEFAULT NULL,
  `insurant_card_id` int NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel_record_id` bigint unsigned DEFAULT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_target_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unsettled_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countdown_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `countdown_type_id` int NOT NULL,
  `ApplicantName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `InsurantName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentStatus` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.reactivate definition

CREATE TABLE `reactivate` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.reactivate2 definition

CREATE TABLE `reactivate2` (
  `applicant` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carer_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `status_id` int unsigned DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.reactivate_applicants definition

CREATE TABLE `reactivate_applicants` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_B2B` int NOT NULL DEFAULT '0',
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.receipts definition

CREATE TABLE `receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL COMMENT 'CS (Crowdshare), DT (Deposit Top Up), AF (Annual Fee), VP (Voucher Purchase), AP (Advanced Purchase), PP (Penalty)',
  `type_id` int NOT NULL,
  `payment_id` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164937 DEFAULT CHARSET=latin1;


-- gathercare_wecare.reference_codes definition

CREATE TABLE `reference_codes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ref_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_user_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expired_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.refunding_20230423 definition

CREATE TABLE `refunding_20230423` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` varchar(100) NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_status519` int NOT NULL,
  `blnUnsettlement` int NOT NULL,
  `setSuspended` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.refunds definition

CREATE TABLE `refunds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_amount` decimal(8,2) unsigned DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reason` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refunds_uuid_unique` (`uuid`),
  KEY `refunds_reason_index` (`reason`),
  KEY `refunds_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=9135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.refunds_20230328 definition

CREATE TABLE `refunds_20230328` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_amount` decimal(8,2) unsigned DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reason` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.roles definition

CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.share_value_balances definition

CREATE TABLE `share_value_balances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `target_type` varchar(255) NOT NULL,
  `target_id` int NOT NULL,
  `balance` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=latin1;


-- gathercare_wecare.share_value_tx definition

CREATE TABLE `share_value_tx` (
  `id` int NOT NULL AUTO_INCREMENT,
  `target_type` varchar(255) NOT NULL,
  `target_id` int NOT NULL,
  `amount` decimal(10,4) NOT NULL,
  `source_type` varchar(255) NOT NULL,
  `source_id` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1;


-- gathercare_wecare.sms_template_groups definition

CREATE TABLE `sms_template_groups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_group_name` (`group_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.temp_changepassword definition

CREATE TABLE `temp_changepassword` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(20) NOT NULL,
  `TacCode` varchar(8) NOT NULL,
  `createdon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expiry` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4954 DEFAULT CHARSET=latin1;


-- gathercare_wecare.temp_newapplicant definition

CREATE TABLE `temp_newapplicant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `TacCode` varchar(8) NOT NULL,
  `createdon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(255) DEFAULT NULL,
  `token_expiry` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4129 DEFAULT CHARSET=latin1;


-- gathercare_wecare.token_issue definition

CREATE TABLE `token_issue` (
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `channel_reference_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `status_id` bigint unsigned NOT NULL DEFAULT '1',
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.topup definition

CREATE TABLE `topup` (
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `id` bigint unsigned NOT NULL DEFAULT '0',
  `insurant_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SharingDeposit` decimal(18,2),
  `applicant_id` bigint unsigned DEFAULT NULL,
  `status_id` int unsigned NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.topup_recurring definition

CREATE TABLE `topup_recurring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) NOT NULL,
  `insurant_id` int NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `nett_amount` decimal(18,2) NOT NULL,
  `batch_no` int NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_id` int NOT NULL,
  `latest_balance` decimal(18,2) NOT NULL,
  `sharing_deposit` decimal(18,2) NOT NULL,
  `topup_amount` decimal(18,2) NOT NULL,
  `payment_status` int NOT NULL,
  `meta` varchar(200) NOT NULL,
  `bln_carepoint` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=296 DEFAULT CHARSET=latin1;


-- gathercare_wecare.topup_recurring_batch definition

CREATE TABLE `topup_recurring_batch` (
  `id` int NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL DEFAULT '0',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `batch_no` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_id` (`insurant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=512 DEFAULT CHARSET=latin1;


-- gathercare_wecare.translations definition

CREATE TABLE `translations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `app` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6880 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.user_guides definition

CREATE TABLE `user_guides` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_upload_id` bigint unsigned DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_guides_is_active` (`is_active`),
  KEY `idx_user_guides_sort_order` (`sort_order`),
  KEY `idx_user_guides_file_upload_id` (`file_upload_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


-- gathercare_wecare.user_setup_progresses definition

CREATE TABLE `user_setup_progresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `step_key` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `data` json DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2905 DEFAULT CHARSET=latin1;


-- gathercare_wecare.vouchers definition

CREATE TABLE `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `voucher_charge` decimal(18,2) NOT NULL,
  `voucher_value` decimal(18,2) NOT NULL,
  `yearly_max` int NOT NULL,
  `trx_charge_percent` decimal(5,1) NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


-- gathercare_wecare.withdrawal_refunded definition

CREATE TABLE `withdrawal_refunded` (
  `id` int NOT NULL DEFAULT '0',
  `uuid` varchar(36) NOT NULL,
  `insurant_id` int NOT NULL,
  `status_id` int NOT NULL,
  `deposit_balance` decimal(8,2) NOT NULL,
  `reason` varchar(2000) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'created',
  `refunded_on` date NOT NULL,
  `refunded_amount` decimal(18,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `april23_cs` decimal(18,2) NOT NULL,
  `cs_apr23` decimal(8,2) NOT NULL,
  `remarks` varchar(5000) NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.withdrawalcarer_20230425 definition

CREATE TABLE `withdrawalcarer_20230425` (
  `id` int NOT NULL DEFAULT '0',
  `uuid` varchar(36) NOT NULL,
  `insurant_id` int NOT NULL,
  `status_id` int NOT NULL,
  `deposit_balance` decimal(8,2) NOT NULL,
  `reason` varchar(2000) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'created',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `carer_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- gathercare_wecare.withdrawals definition

CREATE TABLE `withdrawals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `insurant_id` int NOT NULL,
  `status_id` int NOT NULL,
  `deposit_balance` decimal(8,2) NOT NULL,
  `reason` varchar(2000) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'created',
  `refunded_on` date NOT NULL,
  `refunded_amount` decimal(18,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `april23_cs` decimal(18,2) NOT NULL,
  `cs_apr23` decimal(8,2) NOT NULL,
  `remarks` varchar(5000) NOT NULL,
  `cancelled_by` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_id` (`insurant_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1109 DEFAULT CHARSET=latin1;


-- gathercare_wecare.agents definition

CREATE TABLE `agents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `status_id` smallint unsigned DEFAULT NULL,
  `is_special_agent` tinyint(1) NOT NULL DEFAULT '0',
  `is_exam_passed` tinyint(1) NOT NULL DEFAULT '0',
  `tier` tinyint unsigned NOT NULL DEFAULT '1',
  `current_month_kpi` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_login_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agents_uuid_unique` (`uuid`),
  KEY `agents_applicant_id_foreign` (`applicant_id`),
  KEY `agents_status_id_foreign` (`status_id`),
  KEY `agents_agency_id_foreign` (`agency_id`),
  CONSTRAINT `agents_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`),
  CONSTRAINT `agents_applicant_id_foreign` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`),
  CONSTRAINT `agents_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `agent_statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3631 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.applicant_role definition

CREATE TABLE `applicant_role` (
  `applicant_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`applicant_id`,`role_id`),
  KEY `fk_applicant_role_role` (`role_id`),
  CONSTRAINT `fk_applicant_role_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_applicant_role_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.applicants_BCK definition

CREATE TABLE `applicants_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `own_referralcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_introcode` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailSecureCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blnEmailVerified` int NOT NULL DEFAULT '0',
  `DOB` date NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Level` int NOT NULL,
  `Age` int NOT NULL,
  `ApplicantsTypeID` int NOT NULL DEFAULT '1',
  `type_id` smallint NOT NULL DEFAULT '0' COMMENT '0 - personnal, 1 - corporate',
  `corporate_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not null if type applicant type_id is corporate',
  `partner_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ReferralCode_AddedOn` date NOT NULL,
  `preferred_language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `income` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6' COMMENT '1- <2000, 2 - 2000-4000, 3 - 4001-6000, 4- 6001-10000 ,  5- >10000, 6 - Not Recognized',
  `MediaChannelID` int NOT NULL,
  `oth_media` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `Images` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriImages` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` tinyint(1) NOT NULL DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `applicants_phone_number_unique` (`phone_number`),
  UNIQUE KEY `applicants_uuid_unique` (`uuid`),
  KEY `applicants_old_member_id_index` (`old_member_id`),
  KEY `applicants_upline_type_upline_id_index` (`upline_type`,`upline_id`),
  KEY `applicants_phone_number_index` (`phone_number`),
  KEY `applicants_agency_id_foreign` (`agency_id`),
  CONSTRAINT `applicants_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.attachments definition

CREATE TABLE `attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachment_type_id` int unsigned NOT NULL,
  `owner_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_id` bigint unsigned NOT NULL,
  `access` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'public',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `attachments_attachment_type_id_foreign` (`attachment_type_id`),
  CONSTRAINT `attachments_attachment_type_id_foreign` FOREIGN KEY (`attachment_type_id`) REFERENCES `attachment_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18741 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.commission_structures definition

CREATE TABLE `commission_structures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `agency_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `tiers_available` tinyint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `commission_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commission_structures_agency_id_foreign` (`agency_id`),
  CONSTRAINT `commission_structures_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.count_downs_BCK definition

CREATE TABLE `count_downs_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int unsigned NOT NULL,
  `target_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` bigint unsigned NOT NULL,
  `count_down` int DEFAULT NULL,
  `count_down_unit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `executed_at` datetime DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `count_downs_type_id_foreign` (`type_id`),
  KEY `count_downs_target_type_target_id_index` (`target_type`,`target_id`),
  KEY `count_downs_count_down_index` (`count_down`),
  KEY `count_downs_executed_at_index` (`executed_at`),
  KEY `count_downs_effective_date_index` (`effective_date`),
  CONSTRAINT `count_downs_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `count_down_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.crowd_share_details_BCK definition

CREATE TABLE `crowd_share_details_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `insurant_package_id` bigint unsigned DEFAULT NULL,
  `insurant_package_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_package_weightage` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_package_weightage_total` decimal(8,2) unsigned DEFAULT NULL,
  `insurant_count` int unsigned NOT NULL DEFAULT '1',
  `sharing_cost_each` decimal(8,2) NOT NULL DEFAULT '0.00',
  `sharing_cost_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `crowd_share_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `crowd_share_details_created_at_index` (`created_at`),
  KEY `crowd_share_details_updated_at_index` (`updated_at`),
  KEY `crowd_share_details_insurant_package_id_foreign` (`insurant_package_id`),
  CONSTRAINT `crowd_share_details_insurant_package_id_foreign` FOREIGN KEY (`insurant_package_id`) REFERENCES `insurant_packages3` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.crowd_share_records_BCK definition

CREATE TABLE `crowd_share_records_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL,
  `insurant_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crowd_share_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `crowd_share_details_id` int unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `crowd_share_records_insurant_id_foreign` (`insurant_id`),
  KEY `crowd_share_records_crowd_share_id_foreign` (`crowd_share_id`),
  CONSTRAINT `crowd_share_records_crowd_share_id_foreign` FOREIGN KEY (`crowd_share_id`) REFERENCES `crowd_shares_BCK` (`id`) ON DELETE CASCADE,
  CONSTRAINT `crowd_share_records_insurant_id_foreign` FOREIGN KEY (`insurant_id`) REFERENCES `insurants_bck` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.gp_points_balances definition

CREATE TABLE `gp_points_balances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `last_updated` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_id` (`applicant_id`),
  CONSTRAINT `gp_points_balances_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.gp_points_transactions definition

CREATE TABLE `gp_points_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `reference_type` varchar(255) DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `description` text,
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_id` (`applicant_id`),
  CONSTRAINT `gp_points_transactions_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


-- gathercare_wecare.insurant_balance_records_BCK definition

CREATE TABLE `insurant_balance_records_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurant_id` bigint unsigned NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `latest_balance` decimal(8,2) DEFAULT NULL,
  `source_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned NOT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_balance_records_uuid_unique` (`uuid`),
  KEY `insurant_balance_records_insurant_id_foreign` (`insurant_id`),
  KEY `insurant_balance_records_source_type_source_id_index` (`source_type`,`source_id`),
  CONSTRAINT `insurant_balance_records_insurant_id_foreign` FOREIGN KEY (`insurant_id`) REFERENCES `insurants_bck` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_benefit_items definition

CREATE TABLE `insurant_benefit_items` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `benefit_level_id` smallint unsigned NOT NULL,
  `count_down_type_id` int unsigned DEFAULT NULL,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefits_en` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefits_zh` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefits_ms` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `initial_amount` bigint unsigned NOT NULL,
  `annual_increment` bigint unsigned DEFAULT NULL,
  `limit_day` int NOT NULL,
  `year_unlimited` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_benefit_items_key_unique` (`key`),
  KEY `insurant_benefit_items_benefit_level_id_foreign` (`benefit_level_id`),
  KEY `count_down_type_id_fk` (`count_down_type_id`),
  CONSTRAINT `insurant_benefit_items_benefit_level_id_foreign` FOREIGN KEY (`benefit_level_id`) REFERENCES `insurant_benefit_levels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_benefits_BCK definition

CREATE TABLE `insurant_benefits_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL,
  `item_id` smallint unsigned NOT NULL,
  `amount` bigint unsigned NOT NULL,
  `is_unlimited` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurant_benefits_insurant_id_item_id_unique` (`insurant_id`,`item_id`),
  KEY `insurant_benefits_item_id_foreign` (`item_id`),
  CONSTRAINT `insurant_benefits_insurant_id_foreign` FOREIGN KEY (`insurant_id`) REFERENCES `insurants_bck` (`id`),
  CONSTRAINT `insurant_benefits_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `insurant_benefit_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurant_cards_BCK definition

CREATE TABLE `insurant_cards_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ccbrand` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_issuer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cctype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `insurant_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TokenInfo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_cards_applicant_id_foreign` (`applicant_id`),
  CONSTRAINT `applicant_cards_applicant_id_foreign` FOREIGN KEY (`applicant_id`) REFERENCES `applicants_BCK` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.insurants definition

CREATE TABLE `insurants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit_balance` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `insurant_package_id` bigint unsigned NOT NULL DEFAULT '4',
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `penalty_paid` int DEFAULT '0',
  `pending_annualfee` date DEFAULT NULL,
  `gl_waiting_period` date DEFAULT NULL,
  `is_smoker` tinyint(1) DEFAULT NULL,
  `benefit_level_id` smallint unsigned NOT NULL DEFAULT '1',
  `beneficiary_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiary_contact` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverage_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `bereavement_amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_id` bigint unsigned DEFAULT NULL,
  `ReferralCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_id` int NOT NULL,
  `ReferralCode_ApplicantsTypeID` int NOT NULL,
  `IntroCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nric` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `race` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4' COMMENT '0 - chinese, 1 - malay 2-indian 3-others 4-not recognized',
  `oth_race` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_with_applicant` smallint unsigned NOT NULL COMMENT '1 = self, 2 = children, 3  = others',
  `oth_relation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` int NOT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` int NOT NULL,
  `jobscope` int NOT NULL,
  `income` int NOT NULL,
  `marital` int NOT NULL,
  `oth_marital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_dependant` int NOT NULL,
  `emergency_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_phone_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bereavement_relationship` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `first_payment_date` timestamp NULL DEFAULT NULL,
  `first_activation_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `old_member_id` bigint unsigned DEFAULT NULL,
  `b2b_company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `insurants_uuid_unique` (`uuid`),
  KEY `insurants_applicant_id_foreign` (`applicant_id`),
  KEY `insurants_benefit_level_id_foreign` (`benefit_level_id`),
  KEY `insurants_status_id_foreign` (`status_id`),
  KEY `insurants_insurant_package_id_foreign` (`insurant_package_id`),
  KEY `insurants_old_member_id_index` (`old_member_id`),
  KEY `insurants_nric_index` (`nric`),
  KEY `insurants_name_index` (`name`),
  KEY `insurants_first_payment_date_index` (`first_payment_date`),
  KEY `applicant_id` (`applicant_id`),
  CONSTRAINT `insurants_applicant_id_foreign` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`),
  CONSTRAINT `insurants_benefit_level_id_foreign` FOREIGN KEY (`benefit_level_id`) REFERENCES `insurant_benefit_levels` (`id`),
  CONSTRAINT `insurants_insurant_package_id_foreign` FOREIGN KEY (`insurant_package_id`) REFERENCES `insurant_packages` (`id`),
  CONSTRAINT `insurants_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `insurant_statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13479 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.kpi_records definition

CREATE TABLE `kpi_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_id` tinyint unsigned NOT NULL,
  `agent_id` bigint unsigned NOT NULL,
  `kpi` bigint unsigned NOT NULL,
  `kpi_to_upgrade` int unsigned DEFAULT NULL,
  `kpi_to_maintain` int unsigned NOT NULL,
  `tier_before` tinyint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kpi_records_uuid_unique` (`uuid`),
  KEY `kpi_records_agent_id_foreign` (`agent_id`),
  KEY `kpi_records_status_id_index` (`status_id`),
  CONSTRAINT `kpi_records_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.medical_cases_BCK definition

CREATE TABLE `medical_cases_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_no` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hospital_id` bigint unsigned NOT NULL,
  `insurant_id` bigint unsigned DEFAULT NULL,
  `patient_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `admission_time` time DEFAULT NULL,
  `discharged_date` date DEFAULT NULL,
  `issued_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guarantee_amount` decimal(8,2) DEFAULT NULL,
  `extra_amount` decimal(8,2) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Created',
  `crowd_share_id` bigint unsigned DEFAULT NULL,
  `old_case_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '1',
  `approval_on` datetime NOT NULL,
  `approval_by` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medical_cases_uuid_unique` (`uuid`),
  KEY `medical_cases_hospital_id_foreign` (`hospital_id`),
  KEY `medical_cases_insurant_id_foreign` (`insurant_id`),
  KEY `medical_cases_crowd_share_id_foreign` (`crowd_share_id`),
  KEY `medical_cases_status_index` (`status`),
  CONSTRAINT `medical_cases_crowd_share_id_foreign` FOREIGN KEY (`crowd_share_id`) REFERENCES `crowd_shares_BCK` (`id`),
  CONSTRAINT `medical_cases_hospital_id_foreign` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_panels` (`id`),
  CONSTRAINT `medical_cases_insurant_id_foreign` FOREIGN KEY (`insurant_id`) REFERENCES `insurants_bck` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.medical_profiles definition

CREATE TABLE `medical_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `insurant_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medical_profiles_insurant_id_foreign` (`insurant_id`),
  CONSTRAINT `medical_profiles_insurant_id_foreign` FOREIGN KEY (`insurant_id`) REFERENCES `insurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12976 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.mlm_records definition

CREATE TABLE `mlm_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `downline_id` bigint unsigned NOT NULL,
  `level` int unsigned NOT NULL,
  `upline_id` bigint unsigned NOT NULL,
  `upline_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agency_id` bigint unsigned DEFAULT NULL,
  `commission_structure_id` bigint unsigned DEFAULT NULL,
  `kpi` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mlm_records_uuid_unique` (`uuid`),
  KEY `mlm_records_commission_structure_id_foreign` (`commission_structure_id`),
  KEY `mlm_records_upline_type_upline_id_index` (`upline_type`,`upline_id`),
  KEY `mlm_records_level_index` (`level`),
  KEY `mlm_records_agency_id_index` (`agency_id`),
  KEY `mlm_records_downline_id_index` (`downline_id`),
  CONSTRAINT `mlm_records_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`),
  CONSTRAINT `mlm_records_commission_structure_id_foreign` FOREIGN KEY (`commission_structure_id`) REFERENCES `commission_structures` (`id`),
  CONSTRAINT `mlm_records_downline_id_foreign` FOREIGN KEY (`downline_id`) REFERENCES `applicants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10048260 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.news_article_reactions definition

CREATE TABLE `news_article_reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `news_article_id` int NOT NULL COMMENT 'ID of the news article being reacted to',
  `applicant_id` int NOT NULL COMMENT 'ID of the applicant who created the reaction',
  `reaction_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of reaction (like, love)',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_article_reactions_article_applicant_unique` (`news_article_id`,`applicant_id`),
  KEY `news_article_reactions_news_article_id_index` (`news_article_id`),
  KEY `news_article_reactions_applicant_id_index` (`applicant_id`),
  KEY `news_article_reactions_reaction_type_index` (`reaction_type`),
  CONSTRAINT `news_article_reactions_news_article_id_foreign` FOREIGN KEY (`news_article_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.partner_product_orders definition

CREATE TABLE `partner_product_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `merchandise_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `merchandise_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
  `applicant_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_id` int unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `partner_product_orders_merchandise_type_merchandise_id_index` (`merchandise_type`,`merchandise_id`),
  KEY `partner_product_orders_applicant_uuid_foreign` (`applicant_uuid`),
  KEY `partner_product_orders_status_id_foreign` (`status_id`),
  KEY `partner_product_orders_created_at_index` (`created_at`),
  KEY `partner_product_orders_updated_at_index` (`updated_at`),
  CONSTRAINT `partner_product_orders_applicant_uuid_foreign` FOREIGN KEY (`applicant_uuid`) REFERENCES `applicants` (`uuid`),
  CONSTRAINT `partner_product_orders_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `partner_product_order_statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=526 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.payment_logs_BCK definition

CREATE TABLE `payment_logs_BCK` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned DEFAULT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `razer_transaction_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not being used anymore. Refer to payment_id',
  `razer_transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Not being used anymore. Refer to payment_id',
  `response_body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_logs_payment_id_foreign` (`payment_id`),
  CONSTRAINT `payment_logs_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments_BCK` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.razer_merchant_initiated_transactions definition

CREATE TABLE `razer_merchant_initiated_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'card',
  `amount` decimal(8,2) NOT NULL,
  `transID` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `applicant_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `razer_merchant_initiated_transactions_applicant_id_foreign` (`applicant_id`),
  CONSTRAINT `razer_merchant_initiated_transactions_applicant_id_foreign` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.razer_refund_transactions definition

CREATE TABLE `razer_refund_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'card',
  `amount` decimal(8,2) NOT NULL,
  `transID` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_desc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `applicant_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `razer_refund_transactions_applicant_id_foreign` (`applicant_id`),
  CONSTRAINT `razer_refund_transactions_applicant_id_foreign` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.razer_user_initiated_transactions definition

CREATE TABLE `razer_user_initiated_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'card',
  `amount` decimal(8,2) NOT NULL,
  `transID` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_desc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `applicant_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `razer_user_initiated_transactions_applicant_id_foreign` (`applicant_id`),
  CONSTRAINT `razer_user_initiated_transactions_applicant_id_foreign` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.referral_codes definition

CREATE TABLE `referral_codes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `applicant_id` bigint unsigned NOT NULL,
  `code` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `referral_codes_code_unique` (`code`),
  KEY `referral_codes_applicant_id_index` (`applicant_id`),
  CONSTRAINT `referral_codes_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13283 DEFAULT CHARSET=latin1;


-- gathercare_wecare.referrals definition

CREATE TABLE `referrals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `referral_code_id` bigint unsigned NOT NULL,
  `referrer_id` bigint unsigned NOT NULL,
  `referred_id` bigint unsigned NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `qualified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `referrals_referred_id_unique` (`referred_id`),
  KEY `referrals_referral_code_id_index` (`referral_code_id`),
  KEY `referrals_referrer_id_index` (`referrer_id`),
  KEY `referrals_status_index` (`status`),
  CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referral_code_id`) REFERENCES `referral_codes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referrer_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `referrals_ibfk_3` FOREIGN KEY (`referred_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8355 DEFAULT CHARSET=latin1;


-- gathercare_wecare.role_permissions definition

CREATE TABLE `role_permissions` (
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.sms_blasts definition

CREATE TABLE `sms_blasts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `template_group_id` int unsigned NOT NULL,
  `filter_criteria` json NOT NULL,
  `total_recipients` int DEFAULT '0',
  `sent_count` int DEFAULT '0',
  `failed_count` int DEFAULT '0',
  `status` enum('draft','processing','scheduled','sending','completed','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sms_blasts_template_group` (`template_group_id`),
  KEY `idx_status` (`status`),
  KEY `idx_scheduled_at` (`scheduled_at`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `fk_sms_blasts_created_by` FOREIGN KEY (`created_by`) REFERENCES `applicants` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_sms_blasts_template_group` FOREIGN KEY (`template_group_id`) REFERENCES `sms_template_groups` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.sms_templates definition

CREATE TABLE `sms_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `template_group_id` int unsigned DEFAULT NULL,
  `template_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `template_body` mediumtext COLLATE utf8mb4_unicode_ci,
  `language` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_template_group_language` (`template_group_id`,`language`),
  KEY `idx_template_group_id` (`template_group_id`),
  CONSTRAINT `fk_sms_templates_group` FOREIGN KEY (`template_group_id`) REFERENCES `sms_template_groups` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.unsettled_payments definition

CREATE TABLE `unsettled_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Payment uuid that failed and created this unsettled payment record.',
  `attempt_payment_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Payment uuid for payment that attempted to settle this unsettled payment record.',
  `b2bd_payment_uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempt_payment_channel_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Payment channel for payment that attempted to settle this unsettled payment record.',
  `payment_type_id` smallint unsigned NOT NULL COMMENT 'Payment type id, should be same for both failed and attempted payment.',
  `insurant_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Insurant who failed the payment.',
  `applicant_uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Applicant who failed the payment',
  `is_settled` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Is this unsettled payment settled?',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `unsettled_payments_failed_payment_uuid_foreign` (`failed_payment_uuid`),
  KEY `unsettled_payments_attempt_payment_uuid_foreign` (`attempt_payment_uuid`),
  KEY `unsettled_payments_payment_type_id_foreign` (`payment_type_id`),
  KEY `unsettled_payments_insurant_uuid_foreign` (`insurant_uuid`),
  KEY `unsettled_payments_applicant_uuid_foreign` (`applicant_uuid`),
  CONSTRAINT `unsettled_payments_applicant_uuid_foreign` FOREIGN KEY (`applicant_uuid`) REFERENCES `applicants` (`uuid`),
  CONSTRAINT `unsettled_payments_insurant_uuid_foreign` FOREIGN KEY (`insurant_uuid`) REFERENCES `insurants` (`uuid`),
  CONSTRAINT `unsettled_payments_payment_type_id_foreign` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35914 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.users definition

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` bigint unsigned NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_foreign` (`role`),
  CONSTRAINT `users_role_foreign` FOREIGN KEY (`role`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.claims definition

CREATE TABLE `claims` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `claim_number` varchar(255) NOT NULL,
  `applicant_id` bigint unsigned NOT NULL,
  `carer_id` bigint unsigned NOT NULL,
  `claim_type` enum('allowance','pay_and_claim','clinic_visit') NOT NULL,
  `status` enum('submitted','pending','processing','approved','rejected') NOT NULL DEFAULT 'submitted',
  `admission_reference_number` varchar(255) DEFAULT NULL,
  `hospital_name` varchar(255) NOT NULL,
  `admission_date` date NOT NULL,
  `discharge_date` date DEFAULT NULL,
  `diagnosis` text NOT NULL,
  `treatment_type` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `carer_bank_details` text NOT NULL,
  `follow_up_treatment` text,
  `total_claim_amount` decimal(10,2) DEFAULT NULL,
  `approved_amount` decimal(10,2) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text,
  `remarks` text,
  `created_by` bigint unsigned NOT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `claim_number` (`claim_number`),
  KEY `idx_applicant_id` (`applicant_id`),
  KEY `idx_carer_id` (`carer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_claim_type` (`claim_type`),
  KEY `idx_admission_date` (`admission_date`),
  KEY `idx_created_at` (`created_at`),
  KEY `claims_ibfk_3` (`created_by`),
  KEY `claims_ibfk_4` (`updated_by`),
  CONSTRAINT `claims_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claims_ibfk_2` FOREIGN KEY (`carer_id`) REFERENCES `insurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claims_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `applicants` (`id`),
  CONSTRAINT `claims_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `applicants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


-- gathercare_wecare.commission_levels definition

CREATE TABLE `commission_levels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `structure_id` bigint unsigned NOT NULL,
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int NOT NULL DEFAULT '0',
  `commission_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cbl_type` int NOT NULL COMMENT '1- rm20, 2-rm10',
  PRIMARY KEY (`id`),
  UNIQUE KEY `commission_levels_code_unique` (`code`),
  KEY `commission_levels_level_index` (`level`),
  KEY `commission_levels_name_index` (`name`),
  KEY `commission_levels_structure_id_foreign` (`structure_id`),
  CONSTRAINT `commission_levels_structure_id_foreign` FOREIGN KEY (`structure_id`) REFERENCES `commission_structures` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- gathercare_wecare.guarantee_letters definition

CREATE TABLE `guarantee_letters` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `gl_reference_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `carer_id` bigint unsigned NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `facility_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facility_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_amount` decimal(10,2) DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guarantee_letters_gl_reference_number_unique` (`gl_reference_number`),
  KEY `guarantee_letters_carer_id_index` (`carer_id`),
  KEY `guarantee_letters_status_index` (`status`),
  KEY `guarantee_letters_facility_code_index` (`facility_code`),
  CONSTRAINT `guarantee_letters_carer_id_foreign` FOREIGN KEY (`carer_id`) REFERENCES `insurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.sms_blast_recipients definition

CREATE TABLE `sms_blast_recipients` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sms_blast_id` int unsigned NOT NULL,
  `recipient_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `variables` json DEFAULT NULL,
  `status` enum('pending','sent','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_blast_id_status` (`sms_blast_id`,`status`),
  KEY `idx_recipient_phone` (`recipient_phone`),
  CONSTRAINT `fk_sms_blast_recipients_blast` FOREIGN KEY (`sms_blast_id`) REFERENCES `sms_blasts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12569 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- gathercare_wecare.claim_documents definition

CREATE TABLE `claim_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `claim_id` bigint unsigned NOT NULL,
  `file_upload_id` bigint unsigned NOT NULL,
  `document_type` enum('hospitalisationBill','receiptOfPayment','medicalReport','referralLetter','doctorReport','proofOfPayment','additionalDocuments') NOT NULL,
  `document_category` varchar(100) NOT NULL DEFAULT 'claim',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_claim_file` (`claim_id`,`file_upload_id`),
  KEY `idx_claim_id` (`claim_id`),
  KEY `idx_file_upload_id` (`file_upload_id`),
  KEY `idx_document_type` (`document_type`),
  KEY `idx_document_category` (`document_category`),
  CONSTRAINT `claim_documents_ibfk_1` FOREIGN KEY (`claim_id`) REFERENCES `claims` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- gathercare_wecare.claim_timelines definition

CREATE TABLE `claim_timelines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `claim_id` bigint unsigned NOT NULL,
  `status` enum('submitted','pending','processing','approved','rejected') NOT NULL,
  `actor_name` varchar(255) DEFAULT NULL,
  `actor_id` bigint unsigned DEFAULT NULL,
  `note` text,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_claim_id` (`claim_id`),
  KEY `idx_status` (`status`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_actor_id` (`actor_id`),
  CONSTRAINT `claim_timelines_ibfk_1` FOREIGN KEY (`claim_id`) REFERENCES `claims` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claim_timelines_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;