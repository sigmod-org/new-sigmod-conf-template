---
title: SIGMOD Call for Research Papers
---

The PACMMOD issues of SIGMOD 2028 seek contributions in all aspects of data management research. Authors of papers published in the PACMMOD issues of SIGMOD 2028 will be invited to present their work at the SIGMOD conference, June 17-June 23, 2028 in Seoul, Korea. The annual ACM SIGMOD conference is a leading international forum for data management researchers, practitioners, developers, and users to explore cutting-edge ideas and results, and to exchange techniques, tools, and experiences.

## Highlights of 2028
-   **New! Submission website: Papers for SIGMOD 2028 are submitted via [CMT](https://cmt3.research.microsoft.com/User/Login?ReturnUrl=%2FSIGMOD2028).**
-   **New! Authors are required to use the same CMT account for all submissions and at least one author must have an institutional address:** see also [Desk Rejection Policy](#reject).
-   **New! Submission Cap per Author**: As was true for SIGMOD 2027, an author may submit a **maximum of 10 papers** to the research track across all submission rounds of SIGMOD 2028. Additionally, authors may only submit a maximum of 3 papers per cycle. Authors submitting three papers in a cycle may be invited to join the PC as a reviewer; if they decline, their last paper will be desk rejected. All submissions by an author that exceed the cap (e.g., the 11th submission onwards overall or the 4th onwards per cycle) will be desk rejected.
-   Four Paper Submission Deadlines: January 17 (Round 1), April 17 (Round 2), July 17 (Round 3), October 17 (Round 4).
-   **New!** **Explicit Guidance on Generative AI Usage: Authors are required to adhere to the [ACM policy on authorship](https://www.acm.org/publications/policies/new-acm-policy-on-authorship). See examples in the [FAQ](https://www.acm.org/publications/policies/frequently-asked-questions).**
-   **New!** E &A papers must include code and other related artifacts (See [Artifacts and Reproducibility](#artifacts))
-   **No Specific Dates Reserved for Interactive Discussion**: The reviewers may ask authors directly and anonymously if further clarifications are needed. This is likely to happen after the author feedback. This is at the discretion of the reviewers and they may seek clarifications when they think it is necessary.
-   **Refined COI Policy**: The COI policy of SIGMOD has been refined to improve clarity.
-   **Desk Rejection Policy**: SIGMOD 2028 enforces a formal [desk rejection policy](#reject). Submissions that fail to meet one or more of the specified criteria will be rejected, possibly without review. For more information, refer to the [Desk Rejection Policy](#reject).
-   **Abstract, COIs and Paper Submission Dates**: Abstracts and COIs need to be submitted a week ahead of the main paper submission on Jan 10, Apr 10, Jul 10, or Oct 10. See also [Dates](#dates). Each author of a paper must have a verified CMT account before submitting an abstract. Each author has to declare their individual domain and PC conflicts during abstract submission. While these conflicts are automatically applied to all their submissions, the authors need to check that conflicts are up to date in each round.
-   **1-Year Embargo**: Rejected papers cannot be submitted to SIGMOD until a full year has passed. I.e. a paper rejected at Round 4 of SIGMOD 2027 can only be resubmitted to Round 4 of SIGMOD 2028 or a later conference.
-   **Double-Anonymity**: All submissions must be anonymized accordingly.
-   **ORCIDs**: ORCIDs are required for all authors at the time of abstract submission. See [Submission Guidelines](#submission).
-   **Appendix**: An appendix as a separate pdf can be submitted along with the paper. Note that the paper must be self-contained and the reviewers are not required to read the appendix. The appendix should be short and used judiciously by authors to include some helpful details such as proofs. A long appendix which covers material that contains contents which in fact expands the scope of the paper and cannot be sufficiently discussed in the main paper (e.g., contains many additional experimental results) will be ignored in the review process. Finally, note that the appendix is only used in the paper review process and will not be part of the camera ready version of accepted papers as it is not part of the official review.
-   **Revision Plans from Authors with Author Feedback (before Decisions)**: With the author feedback, authors are strongly recommended to include an explicit, numbered revision plan before a decision is reached. The proposed revision plan will be taken into account during decision making by the AE and the reviewers. See [Review Process](#review) for more details.
-   **Submission and Review Ethics Committee (SREC)**: Similar to 2027, there is a Submission and Review Ethics Committee to uphold the integrity of the submissions and reviews. Serious cases of ethics violations will be reported to the committee (see [Desk Rejection Policy](#reject) for details).

## Contents
1.  [Topics of Interest & Paper Types](#topics)
2.  [Important Dates](#dates)
3.  [Presentation and Dissemination](#presentation)
4.  [Submission Guidelines](#submission)
5.  [Guidelines for Generative AI Usage](#ai)
6.  [Anonymity Requirements](#anonymity)
7.  [Artifacts and Reproducibility](#artifacts)
8.  [Conflict of Interest (COI)](#conflicts)
9.  [Reviewing Process and Revisions](#review)
10.  [Desk Rejection Policy](#reject)
11.  [Use of CMT](#cmt)
12.  [PC Chairs Contact Information](#contact)

<h2 id="topics">1. Topics of Interest & Paper Types</h2>

We invite submissions relating to all aspects of the data life cycle.

### Topics of Interest
Topics of interest include, but are not limited to:

*Data Management Systems*

-   Monitoring, testing, and tuning database systems
-   Cloud, distributed, decentralized and parallel data management
-   Database systems on emerging hardware
-   Embedded databases, IoT, and Sensor networks
-   Storage, indexing, and physical database design
-   Query processing and optimization
-   Transaction processing
-   Data warehousing, OLAP, Analytics

*Data Models and Languages*

-   Data models and semantics
-   Declarative programming languages and optimization
-   Spatial and temporal data management
-   Graphs, social networks, web data, and semantic web
-   Multimedia and information retrieval
-   Data lakes
-   Uncertain, probabilistic, and approximate databases
-   Streams and complex event processing

*Human-Centric Data Management*

-   Data exploration, visualization, query languages, and user interfaces
-   User-centric and human-in-the-loop data management
-   Human-data interaction
-   Crowdsourced and collaborative data management

*Data Governance, Quality, and Fairness*

-   Data integration, information extraction, and schema matching
-   Data provenance and workflows
-   Metadata management
-   Data security, privacy, and access control
-   Data quality and data cleaning
-   Responsible data management and data fairness

*Modern AI & Data Management*

-   Structured queries over unstructured data: images, video, natural language, etc.
-   Natural language queries
-   Machine learning methods for database engine internals
-   Machine learning methods for database tuning
-   Data management and metadata for machine learning pipelines
-   AI & knowledge bases
-   Data mining & prescriptive analytics in databases
-   Systems for AI

Other topics which are not listed but clearly address data management related challenges are also welcome. SIGMOD also welcomes submissions on inter-disciplinary work, as long as there are clear contributions to management of data.

### Paper Types
The conference invites the submission of (1) Regular Research Papers, (2) Experiment & Analysis (E&A) Studies, and (3) Papers on Data-Intensive & Data Science (DI&DS) Applications that focus on data management challenges relevant to one of the topics in the call for papers. All papers are reviewed by the same SIGMOD program committee.

-   *Regular Research Papers*. Research Papers present original contributions related to aspects of data management mentioned in the list of topics above.
-   *Experimental Analysis (E&A) Studies*. The scientific contribution of an E&A paper lies in providing new insights into the strengths and weaknesses of existing methods in one of the topics in the list above rather than in providing new methods. E&A paper titles must use a suffix of ": \[Experiments & Analysis\]", i.e., the full title of the paper should look like “<paper title>: \[Experiments & Analysis\]”. Note that submissions of this type should be one or more of the following:
    -   *Experimental Survey*: Experimental surveys that compare multiple existing solutions (including open source solutions) to a problem and through extensive experiments, provide a comprehensive perspective on their strengths and weaknesses.
    -   *Experimental Analysis*: Papers that focus on relevant problems or phenomena of data management and through analysis and/or experimentation provide insights on the nature or characteristics of these phenomena.
    -   *Benchmarks and Datasets*: Papers that present new workloads, benchmark data and methods, methods in generating the data, usage of the benchmarks, and example experimental results on the benchmarks. Papers of this category (1) should provide all artifacts in an anonymous repository for review, and (2) if accepted, are expected to release the benchmark and datasets for public use by the research community.
    -   *Reproducibility*: Papers that verify or refute results published in the past and that, through a renewed performance evaluation, help to advance the state of the art.
    -   *User Studies*: Papers in this line explore how data management and analysis can be made more effective when taking into account the people who design, build, and use these processes as well as those who are impacted by their results.
-   *Data-Intensive & Data Science (DI&DS) Applications*. The scientific contribution of a DI&DS submission lies in providing new insights into data management challenges (see list of topics above) from real-world applications. DI&DS paper titles must use a suffix of ": \[Data-Intensive & Data Science Application\]", i.e., the full title of the paper should look like “<paper title>: \[Data-Intensive & Data Science Application\]”. Note that submissions of this type should:
    -   Focus on challenges regarding data life cycle and pipelines in real-world DS applications OR novel data management related challenges in DI&DS fields outside our core (e.g., graphics, networking, astronomy).
    -   Detail deployed solutions for DS&DI applications.
    -   Share real-world experiences for DS&DI applications.
    -   Provide datasets, query logs, benchmarks from real-world systems. Papers of this category (1) should provide all artifacts in an anonymous repository for review, and (2), if accepted, are expected to release the benchmark and datasets for public use by the research community.

<h2 id="dates">2. Important Dates</h2>

There are 4 submission rounds (January, April, July, and October). Authors of submissions with a revision decision will be given approximately one month to submit a revised version. While we strive to adhere to the published timeline, we note that author feedback and notification dates may vary slightly. Submission deadlines are not expected to be altered.

To ensure consistent submission deadlines across different editions of SIGMOD–thereby avoiding confusion and allowing better workload management for the Program Committee–we recognize that deadlines may occasionally coincide with holidays in certain regions or with weekends. However, since holidays and workdays vary across countries and cultures, we encourage authors to plan accordingly and consider submitting a few days early if a deadline overlaps with a local holiday or weekend.

All deadlines are 11:59 PM AoE.

{{dates: SIGMOD research papers}}

<h2 id="presentation">3. Presentation and Dissemination</h2>

Accepted papers will be published in issues of the Proceedings of the ACM on Management of Data (PACMMOD) ([https://dl.acm.org/journal/pacmmod](https://dl.acm.org/journal/pacmmod)), with one issue corresponding to each submission deadline, and invited for presentation at the SIGMOD conference.

We anticipate that all papers will be offered a presentation **and** a poster slot. We reserve the right to alter this plan if the volume of accepted papers cannot reasonably fit in the conference time and space despite best efforts. The number of SIGMOD submissions has been growing steadily over many years resulting in more accepted papers, while the duration of the conference is fixed. Based on the number of papers, all papers may have a shortened presentation time. We may also restructure the program format in a new way to accommodate this. More details of the presentation format will be updated later in the process.

<h2 id="submission">4. Submission Guidelines</h2>

| Submission Link | [https://cmt3.research.microsoft.com/SIGMOD2028/](https://cmt3.research.microsoft.com/SIGMOD2028/) |
| --- | --- |
| **Submission Paper length** | 12 pages excluding references |
| **References** | Unlimited |
| **Appendix** | Yes, as a separate pdf, but only to include essential details. Note that the paper must be self-contained, and the reviewers are not required to read the appendix. The appendix is only used during review and is not part of the camera-ready version of accepted papers. The appendix should be short and used judiciously by authors to include the essential details that may be useful in the review process (e.g., additional proofs). A longer appendix with additional results and material that cannot be sufficiently discussed in the main paper is discouraged and will definitively be ignored in the review process. |
| **File type and size** | PDF (<= 10 MB) |
| **Paper size** | Letter (8.5” x 11”) |
| **Format**
-   LaTeX
-   Word
-   Overleaf

 | 2-column ACM Proceedings format:

-   [sample-sigconf.tex (version 2e)](https://www.acm.org/publications/proceedings-template)
-   [ACM’s official 2-column template](https://www.acm.org/publications/proceedings-template)
-   [ACM’s official 2-column template](https://www.overleaf.com/latex/templates/association-for-computing-machinery-acm-sig-proceedings-template/bmvfhcdnxfty)

 |
| **Anonymity** | Double-anonymity (see below) |
| **Camera Ready Paper length** | 13 pages excluding references (for all accepted papers), no appendix, in 2-column ACM format, converted to the PACMMOD format |

### Authorship
We limit the number of submissions per author to a maximum of 10. If more than 10 papers are submitted with the same person listed as an author, the additional papers submitted after the initial 10, will be rejected without review. Similarly, authors are restricted to submitting at most three papers per cycle (see the [Desk Rejection Policy](#reject)). Revision submissions are not counted.

Additional information:

-   No changes to author lists are allowed after submission.
-   No changes to title are allowed after submission except by AE request.
-   Submitted papers must print without difficulty on a variety of printers, using Adobe Acrobat Reader. It is the responsibility of the authors to ensure that their submitted PDF file will print easily on simple default configurations.
-   Please make sure you are using the latest version of the ACM template. The font size, margins, inter-column spacing, and line spacing in the templates must be kept unchanged.
-   Accepted papers will need to be ported to the PACMMOD format for final publication. Do not use PACMMOD format for submission or revision.

### Duplicate Submissions and Novelty Requirement
Following the [ACM guidelines](https://www.acm.org/publications/policies/simultaneous-submissions), a paper submitted to SIGMOD 2028 cannot be under review for any other publishing forum or presentation venue, including conferences, workshops, and journals, during the time it is being considered for SIGMOD. Furthermore, after you submit a paper to SIGMOD, you must await the response from SIGMOD and only re-submit elsewhere if your paper is rejected—or withdrawn at your request—from SIGMOD. This restriction applies not only to identical papers but also to papers with a substantial overlap in scientific content and results.

To enforce this requirement, the high-level metadata of submissions (title, abstract, list of authors), may be shared with the Program Chairs / Editors of other conferences and journals.

Every paper submitted to SIGMOD 2028 must present substantial novelty and include material not described in any prior publication. In this context, a prior publication is (a) a paper of five pages or more, presented, or accepted for presentation, at a refereed conference or workshop with proceedings; or (b) an article published, or accepted for publication, in a refereed journal. If a SIGMOD 2028 submission has overlap with a prior publication, the submission must cite the prior publication (respecting the double anonymity requirement) and clearly indicate which parts of the work appeared in prior publications and which parts are novel to the current submission.

*Any violation of this policy will result in the immediate rejection of the submission, as well as in notification to the members of the SIGMOD Executive Committee, the members of the SIGMOD PC, and the editors or chairs of any other forums involved.*

### ACM Publications Policy on Research Involving Human Participants and Subjects
As a published ACM author, you and your co-authors are subject to all [ACM Publications Policies](https://www.acm.org/publications/policies/toc), including ACM's new [Publications Policy on Research Involving Human Participants and Subjects.](https://www.acm.org/publications/policies/research-involving-human-participants-and-subjects)

### Inclusion and Diversity in Writing
We value Diversity and Inclusion in our community and professions. Both are important in our writing as well. Diversity of representation in writing is a simple but visible avenue to celebrate and ultimately help improve our community's diversity. Be mindful in your writing of not using language or examples that further the marginalization, stereotyping, or erasure of any group of people, especially historically marginalized and/or under-represented groups in computing. Be vigilant and guard against unintentionally exclusionary examples.

Please visit this page for many examples of both exclusionary writing to avoid and inclusive writing that celebrates diversity to consider adopting: [https://dbdni.github.io/pages/inclusivewriting.html](https://dbdni.github.io/pages/inclusivewriting.html). Authors are further encouraged to follow the tips and guidelines provided at: [https://dbdni.github.io/#materials](https://dbdni.github.io/#materials). Reviewers will be empowered to monitor and demand changes if such issues arise. Going further, also consider actively raising the representation of under-represented groups in writing.

Please see [https://www.acm.org/diversity-inclusion/words-matter](https://www.acm.org/diversity-inclusion/words-matter) for inclusive alternatives for some of the terms commonly used in the computing profession.

### Open Access Model of ACM
On January 1, 2026, ACM fully transitioned to Open Access. All ACM publications, including those from ACM-sponsored conferences, are 100% Open Access. Authors have two primary options for publishing Open Access articles with ACM: the ACM Open institutional model or by paying Article Processing Charges (APCs). With over [2,700+ institutions](https://libraries.acm.org/acmopen/open-participants) already part of ACM Open and with more institutions joining from around the world every week, the majority of ACM-sponsored conference papers will not require APCs from authors or conferences (currently, around 75% on average across all ACM-sponsored conferences).

Authors from institutions not participating in ACM Open will need to pay an APC to publish their papers, unless they qualify for a geographic or discretionary financial hardship waiver. To find out whether an APC applies to your article, please consult the list of [participating institutions](https://libraries.acm.org/acmopen/open-participants) in ACM Open and review the [Policy on Geographic APC Waivers and Discounts Policy](https://www.acm.org/publications/policies/policy-on-geographic-apc-waivers-and-discounts) and the [Policy on Discretionary APC Waivers](https://www.acm.org/publications/policies/policy-on-discretionary-open-access-apc-waivers) Keep in mind that discretionary waivers are rare and are granted based on specific criteria set by ACM. Simply sending a message to ACM indicating an inability to pay an APC is typically an insufficient justification for such a waiver. Waivers are based on the specific circumstances of the author(s) requesting the waiver. ACM does take seriously into consideration the institutional affiliation of the authors and whether it is a reasonable expectation that their institution should be joining the ACM Open program. This is necessary for the long-term financial sustainability of the ACM Open model.

### Procedure for Withdrawal of Submissions
Authors may withdraw their submissions within one week following the submission deadline without any penalty. After this period, withdrawals will incur a penalty (see [Desk Rejection Policy](#reject)).

To request a withdrawal, authors must email the PC chairs, copying all co-authors in the message, and explicitly stating that all authors consent to the withdrawal.

<h2 id="ai">5. Guidelines for Generative AI Usage</h2>

Authors are required to adhere to the [ACM policy on authorship](https://www.acm.org/publications/policies/new-acm-policy-on-authorship) and must comply with the [ACM policy on the use of Artificial Intelligence](https://www.acm.org/publications/policies/frequently-asked-questions#h-can-i-use-generative-ai-software-tools-to-prepare-my-manuscript?). See examples in the [FAQ](https://www.acm.org/publications/policies/frequently-asked-questions). Of note, the following guidelines should be followed when determining whether and to what extent disclosure must be provided in the Work:

-   When using Artificial Intelligence to conduct research, including the design and methodology of the research project, creation and selection of data sources, designing experiments, generation and collection of data, coding, implementing models, running simulations, data analysis, testing, validating results, deploying software, archiving data and code for reproducibility, or any other aspects of the research lifecycle that are directly relevant to the conclusions of the research underlying the Work, the specific use(s) of AI tools must be described in detail in the methods section of the Work. This includes the creation of artifacts that are directly relevant to the conclusions of the research, such as code, datasets, and charts or figures that rely on the AI tools.
-   When using Artificial Intelligence to assist with writing an ACM submission, ACM no longer requires the disclosure of information regarding the use of AI (as distinct from AI used in the conduct of the research itself, addressed in item 1 above).
-   All named authors on an ACM submission will be held responsible and accountable for any problematic content contained in the submission regardless of the source of that problematic content.
-   If there are still questions, authors may be asked for an online meeting with the PC Chairs to clarify relevance.
-   Generative AI software tools cannot be listed as authors on ACM Works under any conditions.

<h2 id="anonymity">6. Anonymity Requirements</h2>

Research track submissions are subject to the double-anonymity requirement.

Every research track paper submitted to SIGMOD 2028 will undergo a double-anonymous reviewing process, following the three principles put forward in ([Snodgrass 2007](https://arxiv.org/abs/2007.00177)): authors should not be required to go to great lengths to anonymize their submissions; comprehensiveness of the review trumps anonymizing efficacy. AEs retain flexibility and authority in managing the reviewing process.

PC members and referees, except the Associate Editors and PC Chairs, who review the submission will not know the identity of the authors. To ensure anonymity of authorship from the PC members and referees, authors must at least do the following:

-   Authors' names and affiliations must not appear on the title page or elsewhere in the submission.
-   Funding sources must not be acknowledged anywhere in the submission.
-   Research group members, or other colleagues or collaborators, must not be acknowledged anywhere in the submission.
-   The paper’s file name must not identify the authors of the submission.
-   Source file naming must also be done with care, to avoid identifying the authors’ names in the submission’s associated metadata. For example, if your name is Jane Smith and you submit a PDF file generated from a .dvi file called Jane-Smith.dvi, your authorship could be inferred by looking into the PDF file.

To avoid compromising the double-anonymity requirement, we request that authors refrain from publicizing or uploading versions of their submitted manuscripts to pre-publication servers, such as arXiv, or to other online forums during the reviewing period. If a version of the submission is already available on a pre-publication server, such as arXiv, authors do not need to remove it before submitting to SIGMOD.

You must also use care in referring to related past work, particularly your own, in the paper. For example, if you are Jane Smith, the following text gives away the authorship of the submitted paper:

> *In our previous work \[1, 2\], we presented two algorithms for ... In this paper, we build on that work by ...*  
> **Bibliography**  
> *\[1\] Jane Smith, "A Simple Algorithm for ...," Proceedings of ACM SIGMOD 1997, pp. 1 - 10.*  
> *\[2\] Jane Smith, "A More Complicated Algorithm for ...," Proceedings of ACM SIGMOD 1998, pp. 34 - 44.*

The solution is to reference one's past work in the third person. This allows setting the context for your submission while at the same time preserving anonymity:

> *In previous work \[1, 2\], algorithms were presented for ... In this paper, we build on that work by ...*  
> **Bibliography**  
> *\[1\] Jane Smith, "A Simple Algorithm for ...," Proceedings of ACM SIGMOD 1997, pp. 1 - 10.*  
> *\[2\] Jane Smith, "A More Complicated Algorithm for ...," Proceedings of ACM SIGMOD 1998, pp. 34 - 44.*

Despite the anonymity requirements, authors should still include all relevant work of their own in the references, using the above style; omitting them could potentially reveal their identity by negation. However, self-references should be limited to the essential ones, and extended versions of the submitted paper (e.g., technical reports or URLs for downloadable versions) must not be referenced.

Common sense and careful writing can go a long way toward preserving anonymity without diminishing the quality or impact of a paper. The goal is to preserve anonymity while still allowing the reader to fully grasp the context (related past work, including your own) of the submitted paper. In past years, this goal has been achieved successfully by thousands of papers.

*It is the responsibility of authors to do their very best to preserve anonymity. No exceptions will be made to the double anonymity requirement for Research Track papers. If the authors of a submission feel that double anonymity needs to be violated, for example to reveal the identity of a system, they may consider submission to a SIGMOD track that does not impose a double anonymity requirement, such as the Industry Track.*

<h2 id="artifacts">7. Artifacts and Reproducibility</h2>

SIGMOD strives to establish a culture where sharing research artifacts (data, results, code, and scripts) is the norm rather than an exception. SIGMOD reproducibility has three goals: (a) Highlighting the impact of database research papers; (b) enabling easy dissemination of research results; and (c) enabling easy sharing of code and experimentation set-ups. In this context, we expect all papers to make their code, data, scripts, and notebooks available. Submitting artifacts is required for E & A submissions. While submitting artifacts is not mandatory for acceptance other than E & A papers, providing this extra material can help reviewers evaluate your work more thoroughly. Papers published at SIGMOD which have been successfully reproduced are also recognized and highlighted as such in the ACM Digital Library.

Please include a link with your materials in the text box provided in the submission form at the time of submission. For all submissions, the link and materials should preserve anonymity. For example this may be an anonymous GitHub repository. You may want to make sure that the link you provide is not indexed by search engines. On GitHub, you can do so by adding the following to the page head:

<meta name="robots" content="noindex">

We recognize that at the time of submission authors focus on fine-tuning the paper, but the link must be added by the paper deadline. Reviewers that may need to look at the materials will not do so earlier than that. We do not expect a fully polished submission in terms of automatically reproducing results, but rather a reasonably clean version of the state of the code when submitting the paper. Please, do not use a shortened link which traces who accesses it.

In the event that you are not able to submit your code, data, scripts, and notebooks, please explain in the text box provided in the submission form why this is the case.

All submitted artifacts will accompany the paper in the digital library if accepted.

<h2 id="conflicts">8. Conflicts of Interest (COI)</h2>

### Declaring Conflicts of Interest
-   **Each author** is responsible for entering their [ORCID](https://orcid.org/), and their own individual domain and PC conflicts on CMT. We expect authors to have a single unique ORCID: the one used at submission will be used for publication.
-   An author's declared conflicts will be automatically applied to all of their submissions.
-   Conflicts are not declared per submission.
-   Conflict declaration must occur by the abstract submission deadline.
-   Authors need to check that conflicts are up to date in each round.

It is the full responsibility of all authors of a paper to identify all and only their potential conflict-of-interest PC members.

### Definition of Conflicts of Interest (COI)
X and Y have a conflict of interest (COI) if any of the following applies:

-   X and Y have **worked** in the same university or company in the past 5 years, or will be doing so in the next 6 months on account of an accepted job offer. Different campuses within the same university system do not count as the same university for this purpose (e.g., UC Berkeley does not have a conflict with UC Santa Barbara). Short-term associations, such as summer internships do not constitute institutional COIs. E.g., a student who interned at Microsoft should declare as conflicts any individuals in the group they worked with and other collaborators on their projects, but they should not declare a domain conflict with microsoft.com.
-   X has been a **co-author** of a paper with Y in the last 5 years. Note that we consider the **publication year and not the submission year or the month of publication** (i.e., we do not distinguish at month-level granularity). For example, in 2028, the last 5 years start from January 2023 of the paper's publication date.
-   X has been a **research collaborator** with Y within the past 5 years, as evidenced in a joint publication (subsumed by the stricter rule on co-authorship above), joint research project, shared grant funding, or are collaborating now (including co-authorship on papers not resulted in final publication yet). Community publications (typically with a large set of authors) that fall outside the traditional sense of research collaborations (e.g., “The Seattle Report on Database Research”, “Diversity and Inclusion Activities in Database Conferences: A 2021 Report”, Panel reports, etc.) do not in themselves constitute a COI.
-   X has been a **service collaborator** with Y within the past 2 years as evidenced in co-organizing events (e.g., co-chairs of conferences, workshops, tutorials, demos). For instance, X and Y are considered to have a COI if they served together as tutorial co-chairs for SIGMOD 2027. However, chairing different tracks (e.g., demo vs. research) does not constitute a COI.
-   X is the **PhD thesis advisor** or **post-doctoral advisor** of Y or vice versa, irrespective of how long ago this was.
-   X is a **relative** or **close personal friend** of Y (by this it is meant someone with whom one has frequent social interaction and mutual personal trust, outside the normal professional contact (office, conferences, or institutions), that may impair, or appear to impair, the reviewer’s objectivity).

To identify any potentially spurious conflicts, PC members may be asked to confirm declared conflicts with submitting authors.

### Guidelines on Declaring COI in CMT
-   If you plan to submit to SIGMOD 2028, please prepare a list of PC members with whom you have a COI in advance. The list of SIGMOD 2028 PC members will be published on the conference website by the end of December 2026. Each author should maintain their own COI list individually, as this approach is both more practical and accurate than having one author manage it on behalf of all co-authors.
-   A step-by-step guideline to declare COI in CMT is [here](https://2028.sigmod.org/docs/COI%20Declaration.pdf). In summary, kindly ensure that you declare any domain and individual COI, and attest your declaration by selecting the checkbox. Please note that failure to attest to your COI declaration may result in the submission being desk-rejected.
-   Be sure to keep a screenshot of the declared COIs in CMT for every author. If, during the COI declaration process, you are unable to view the PC list in CMT for any reason, contact the PC chairs within 24 hours and include a screenshot showing the issue.
-   Please make sure you are registered as an author for SIGMOD 2028 in CMT. It is best to complete this before the abstract submission deadline to avoid any last-minute issues (e.g., if a co-author is unreachable or traveling).
-   Please note the [Desk Rejection Policy](#reject) related to these issues in Section 10.

<h2 id="review">9. Reviewing Process, Interactive Discussions, and Revisions</h2>

**Number of reviews:** Each submission that is not desk rejected will first receive at least three reviews. At the discretion of the AE and the PC chairs, additional reviews may be procured.

**Author feedback phase**: There is an author feedback phase before decisions are made. Authors will have a few days to read the initial reviews and submit feedback. The feedback (limited length) has two purposes:

1.  **Propose a revision plan**: Based on the reviews, authors can propose a revision plan on how they aim to address the feedback of the reviews in a potential revision. The revision plan will be input to the reviewer discussion to make their decision (accept, revision, reject). In case a paper is selected for a revision, the revision plan will be the basis for the revision. However, reviewers and AEs can still ask for additional requests or changes to the revision plan.
2.  **Clarify misunderstandings**: The second purpose of the author feedback is to clarify misunderstandings and factual errors through pointers to specific text in the submitted paper. As an example, a reviewer may have overlooked a part of the discussion in the paper and state that the paper fails to compare with a certain method; an example feedback will be of the form "We compare to the method suggested by reviewer #3 in Section 2.4, paragraph 3".

**Interactive discussion**: After the author feedback phase, the reviewers may reach out to authors for additional clarifications on the paper or the proposed revision plan. This is initiated by reviewers, and it is up to them to decide whether they should reach out to the authors for further clarifications.

**Decisions:** After the discussions of the reviewers and AEs, each paper will be notified of a decision from Accept / Reject / Minor Revision / Major Revision.

**Revisions:** Some papers will be invited to submit a revised version (minor or major). Authors will have one month to implement the revision items. The revision process is intended to be a constructive partnership between reviewers and authors. To this end, reviewers will be instructed to request revisions only in constructive scenarios with specific requests. The basis for the revision is the revision plan and the additional feedback/requests that reviewers or AEs provided. In turn, authors bear the responsibility of attempting to meet those requests within the stated time frame, or of withdrawing the paper from submission. The revised papers will be reviewed again by the reviewers, and an acceptance after the revision is not guaranteed.

For the revision, one extra content page is allowed after the first review to accommodate the requested revision items. The revised submission should include a revision letter (up to 4 pages) to summarize how the authors have addressed the requested revisions. For papers that go through major or minor revisions, the changed text must be highlighted in different colors for different reviewers, and section/page numbers must be referred to (along with line numbers when possible) in the revision letter, to ease their identification by the reviewers. The extra page is also available for the final version to the papers that are directly accepted.

<h2 id="reject">10. Desk Rejection Policy</h2>

Submissions to the SIGMOD 2028 Research Track that fail to meet the following requirements will be rejected, possibly without review (desk rejection). This policy is adapted from those used by recent editions of major data management conferences.

1\. **Formatting or double-anonymity violations**: Submissions must be double-anonymous and adhere to the guidelines and length requirements outlined in the SIGMOD 2028 Call for Papers. Any deviation from the prescribed format will result in a desk rejection. Note that figures, tables, proofs, appendixes, acknowledgements, or any other content (excluding references) after page 12 of the submission is considered a format violation. If the double-anonymity violation is detected early before reviewing starts (e.g., if Associate Editors spot early that authors’ names are included in the title of the submission), the authors are permitted to resubmit in subsequent rounds. However, if the violation appears within the main text of the submission, associated external codebase (e.g., github), or appendix and can only be discovered during the review process, the submission will be classified as a rejection, and the **one-year embargo** will apply (see below).

2\. **Unregistered authors, multiple CMT accounts, missing ORCID IDs, non-institutional CMT accounts**: Each author is required to have both a registered CMT account for SIGMOD 2028 and an ORCID ID. Authors are required to use the same CMT account for all submissions to SIGMOD 2028. Submissions with authors who lack a CMT registration or an ORCID ID (which must contain identifying information, including affiliations, and must not be set to private mode) will be desk rejected, as will papers by any author who uses multiple CMT accounts All submissions must have at least one author whose CMT address is an institutional address, or they will be desk rejected. If some authors are unable to provide an institutional address, a justification must be provided in the provided space in CMT.

3\. **COI violations**: Authors must correctly declare all conflicts of interest (COI) with the Program Committee (PC chairs, Associate Editors and PC members). All submissions will be checked for validity or omission of COIs via automated software. Both, failing to report COIs and frivolously defining COIs, count as a violation of this requirement. It is the full responsibility of all authors of a paper to identify and declare all COIs with the Program Committee prior to the abstract deadline mentioned in the Call for Papers. Submissions with undeclared conflicts or spurious conflicts will be desk-rejected. If COI violations are discovered after notifications have been sent, any affected submissions will be rejected, even if they were previously accepted or under revision. Egregious violation of COI policy as determined by the PC chairs and the Submission and Review Ethics Committee (SREC) will be treated as unethical behavior (see point 7 below).

4\. **Relevance mismatch (out-of-scope)**: Submissions must be in scope of SIGMOD 2028. Specifically, this means that a submission must align with at least one of the above topic areas defined for SIGMOD 2028, clearly define a concrete data management problem, articulate its technical contributions, and situate them within the state of the art in the database community..

Papers that are not directly relevant to the database community are subject to desk rejection, even if they provide a compelling solution to an otherwise interesting problem. Such papers should be submitted to a more appropriate venue. For example, submissions that purely advance data mining or machine learning approaches not related to data management aspects would be considered out of scope for SIGMOD.

Authors are required to provide a justification (in 1000 characters) in the submission form why their work is relevant to the SIGMOD/database community, and highlight (a) the key data management challenges addressed in the paper and (b) principled ideas and contributions that this work brings to data management. These ideas and contributions should be linked to specific sections of the paper.

Examples: (a) "We propose a new ML technique that enables database systems to achieve X and we clearly demonstrate in the paper (theory, experiments) how the database systems achieve X though our new technique. In particular, in section Z we ..." (b) "We propose a new indexing scheme or modify the query optimizer or we propose a new storage layout to improve the performance of ML or DM model X, and we clearly demonstrate this in the paper. In particular, in section Z we ..." (c) "Although this work is not aligned with the core conference topics, we see that there was a work on the same problem published in a previous data management conference."

Explanations in the spirit of (a) and (b) will be in favor of the paper. Arguments like (c) are not sufficient excuses and are very likely to lead to a desk-reject due to out-of-scope submission. If there are still questions, authors may be asked for an online meeting with the PC Chairs to clarify relevance.

5\. **Incremental submissions from a similar group of authors**: SIGMOD 2028 strongly discourages submissions that constitute incremental extensions of prior work by the same/similar group of authors (large overlap between the authors of a pair of submissions). Specifically, if a group submits a paper in one review round and subsequently submits an incremental extension of that work in the same or a later round, the latter submission may be subject to desk rejection.

Authors who believe that their submission might be perceived as an incremental extension must provide a justification (limited to 1000 characters) in the submission form, clearly articulating why the present work represents a substantive contribution beyond any of their other submissions to SIGMOD 2028.

6\. **Submission cap per author**: As was true for SIGMOD 2027, an author may submit a **maximum of 10** papers to the research track across all submission rounds of SIGMOD 2028. Additionally, each author may only submit a maximum of 3 papers per cycle. Authors submitting three papers in a cycle may be invited to join the PC as a reviewer; if they decline, their last paper will be desk rejected. All submissions by an author that exceed the cap (e.g., the 11th submission onwards overall or the 4th onwards per cycle) will be desk rejected.

7\. **Unethical behavior**: At the discretion of the PC chairs and SREC, a submission may also be rejected due to unethical behavior. These submissions will be reported to the SREC. They may be penalized with the 12-month embargo (see below), as well as other sanctions as decided by SREC. The SREC may report these cases to the ACM and may lead to additional penalties from ACM. Examples include:

-   Contacting any member of the review board regarding your submission (all contact regarding a submission must be made through the PC Chairs) or making other attempts to violate anonymity;
-   Suggesting potential reviewer names to the PC Chairs.
-   Use deceptive methods to obtain confidential information pertaining to the review process.
-   Using strategies to bypass the submission cap per author. For example, using multiple existing CMT accounts (different email addresses) to submit more than 10 submissions.
-   Egregious violation of COI policy as determined by the PC chairs and the SREC.
-   Egregious evidence of plagiarism in a submission as determined by the PC chairs and the SREC.  
    **Authors must not contact any member of the SREC directly. All communications, including appeals, should be addressed exclusively through the PC Chairs.**

**Re-submission policy**: Submissions that are desk-rejected in a given round for reasons (1) to (3) and are not flagged for ethical violation may be resubmitted in a subsequent round. Submissions rejected for reasons (4) to (7) are not eligible for resubmission in later rounds.

**1-year embargo**: Authors are prohibited from resubmitting any work that was previously rejected from the research tracks within **one year of the original submission date** (next 3 rounds/cycles) even if the work has been revised substantially.

Authors are allowed to withdraw their submission **one week** after the submission deadline without incurring any penalty. Submissions withdrawn after that will be treated as rejections, and the **1-year resubmission embargo** will apply to them as well.

In other words, a paper rejected from the research track cannot be resubmitted to the SIGMOD research track **within 12 months (or 3 cycles/rounds, whichever is less) from the original submission date of the rejected work**. Submissions violating the 1-year embargo policy will be rejected if detected at any point of the review cycle and cannot be submitted again in the subsequent rounds of SIGMOD 2028.

**Responsibility**: The responsibility rests with all the authors to ensure their paper meets all submission requirements.

**Current number of authors banned from making a submission to SIGMOD 2028: 1**

<h2 id="cmt">11. Use of CMT</h2>

The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.

<h2 id="contact">12. PC Chairs Contact Information</h2>

sigmodpcchairs2028 at gmail.com
