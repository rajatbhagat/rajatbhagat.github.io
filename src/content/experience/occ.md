---
company: The Options Clearing Corporation
location: Chicago, US
title: Associate Principal Software Engineer — Data Platform
period: Nov 2025 – Jun 2026
order: 1
---

- Owned a change-data-capture service that replicated live production changes for key business entities into a next-generation clearing platform, keeping a production-parallel environment continuously in sync during a major platform migration
- Raised the service's daily message success rate from 85% to 94% over ~5 months — built a log-parsing dashboard to surface breaking exceptions and flows, partnered with business users to close implementation gaps, and defined a mitigation plan for recurring error classes
- Maintained and enhanced the end-to-end pipeline: scheduled 15-minute production extracts to S3, a Python service publishing rows as JSON messages to Kafka, and a Java consumer transforming and delivering them to the target system via API calls
- Restored production data snapshots into lower environments to simulate end-of-day state, tailored to each environment's requirements, supporting the platform migration's testing needs
- Enhanced a Java service syncing user details from LDAP into Apache Iceberg tables feeding downstream Tableau reporting, and owned production deployment and support for the team's services
