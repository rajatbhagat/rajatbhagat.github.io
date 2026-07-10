---
company: Mythics LLC
location: Arlington, US
title: Cloud Developer
period: Jun 2023 – Mar 2024
order: 3
---

- Built FinOps automation ingesting OCI Cost & Usage reports for 24 tenancies (50,000+ records daily) into Oracle Database, reading tenancy credentials from OCI Vault under instance-scoped access policies so private keys were never stored locally
- Developed the cost-monitoring portal (Next.js + TypeScript frontend, Node.js backend with TypeORM) generating reports over tables of 20M+ records; integrated Redis caching to cut report load times from ~1 minute to ~2 seconds; shipped as Docker images on Kubernetes
- Delivered patching-as-a-service for Oracle Exadata systems: Ansible playbooks for asynchronous patch download, pre-checks, patching, and post-patch validation, orchestrated by a Jenkins pipeline driven from JIRA ticket transitions — cutting patching time by 60% and enabling parallel patching with minimal engineer monitoring
- Shipped a weekly CIS-compliance security scan for OCI tenancies as a containerized OCI Function using policy-based auth (no stored credentials), reusable across any tenancy
- Built a portal for dynamic surveys and workflows on the same Next.js/Node.js stack, and provisioned OCI infrastructure for multiple customers using Terraform and Ansible
