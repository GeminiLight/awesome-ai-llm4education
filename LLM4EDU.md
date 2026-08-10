<div align="center">
  <h1>Awesome AI and LLM for Education</h1>
  <p>
    A curated list of papers related to artificial intelligence (AI) and large language model (LLM) for education
  </p>
  <p>
    <strong><a href="http://tianfuwang.tech/awesome-ai-llm4education/" style="text-decoration: none; color:rgb(255, 193, 7);">🚀 Online Webpage</a> |
    </strong><a href="LLM4EDU.md" style="text-decoration: none; color:rgb(69, 162, 255);">🌟 LLM4EDU Version</a> | <a href="README.md" style="text-decoration: none; color:rgb(170, 125, 252);">🤖 Full Version</a>
  </p>
</div>

---

We collect papers related to **artificial intelligence (AI) and large language model (LLM) for education** from top conferences, journals, and specialized domain-specific conferences. We then categorize them according to their specific tasks for better organization.


The catalog is organized into **Surveys, Analyses & Perspectives**, **Teaching & Learning Lifecycle**, **Application Domains**, and **Datasets, Benchmarks & Toolkits**. Lifecycle papers use a third level to distinguish concrete tasks such as tutoring, material preparation, learner modeling, and assessment.
**:sparkles: indicates the papers that are related to LLM.**

> [!note]
> 🎉 Our paper "[SocialCoach: Personalized Social Skill Learning with RL-based Agentic Tutoring and Practice](https://arxiv.org/abs/2606.04155)" has been released!
>
> 🎉 Our paper "[LLM-powered Multi-agent Framework for Goal-oriented Learning in Intelligent Tutoring System](https://arxiv.org/abs/2501.15749)" has been accepted by **WWW 2025 (Industry Track) as Oral Presentation**!
>
> 🎈 Welcome to check our [project page](https://tianfuwang.tech/gen-mentor/) and [demo code](https://github.com/GeminiLight/gen-mentor) to enjoy the goal-oriented learning experience!

## [Content](#content)

![AI4Edu](resources/ai4edu-loop.png)

<!-- <table>
<tr><td colspan="2"><a href="#survey-papers">1. Survey</a></td></tr>
<tr><td colspan="2"><a href="#tasks">2. Tasks</a></td></tr>  -->

<table>
<tr><td colspan="2"><strong><a href="#surveys-analyses-perspectives">1. Surveys, Analyses & Perspectives</a></strong></td></tr>
<tr><td colspan="2">&emsp;<a href="#comprehensive-surveys">1.1. Comprehensive Surveys</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#empirical-analyses">1.2. Empirical Analyses</a></td></tr>
<tr><td colspan="2"><strong><a href="#teaching-learning-lifecycle">2. Teaching & Learning Lifecycle</a></strong></td></tr>
<tr><td colspan="2">&emsp;<a href="#tutoring-systems">2.1. Tutoring Systems</a></td></tr>
<tr>
<td>&emsp;&emsp;<a href="#general-tutoring">2.1.1. General Tutoring</a></td>
<td>&emsp;&emsp;<a href="#learning-path-recommendation">2.1.2. Learning Path Recommendation</a></td>
</tr>
<tr><td colspan="2">&emsp;<a href="#material-preparation">2.2. Material Preparation</a></td></tr>
<tr>
<td>&emsp;&emsp;<a href="#content-generation">2.2.1. Content Generation</a></td>
<td>&emsp;&emsp;<a href="#question-generation">2.2.2. Question Generation</a></td>
</tr>
<tr>
<td>&emsp;&emsp;<a href="#knowledge-structuring">2.2.3. Knowledge Structuring</a></td>
<td>&emsp;&emsp;<a href="#resource-retrieval">2.2.4. Resource Retrieval</a></td>
</tr>
<tr>
<td>&emsp;&emsp;<a href="#instructional-design">2.2.5. Instructional Design</a></td>
<td></td>
</tr>
<tr><td colspan="2">&emsp;<a href="#teaching-support">2.3. Teaching Support</a></td></tr>
<tr>
<td>&emsp;&emsp;<a href="#teaching-assistance">2.3.1. Teaching Assistance</a></td>
<td></td>
</tr>
<tr><td colspan="2">&emsp;<a href="#learner-modeling">2.4. Learner Modeling</a></td></tr>
<tr>
<td>&emsp;&emsp;<a href="#knowledge-tracing">2.4.1. Knowledge Tracing</a></td>
<td>&emsp;&emsp;<a href="#cognitive-diagnosis">2.4.2. Cognitive Diagnosis</a></td>
</tr>
<tr>
<td>&emsp;&emsp;<a href="#student-profiling">2.4.3. Student Profiling</a></td>
<td>&emsp;&emsp;<a href="#student-simulation">2.4.4. Student Simulation</a></td>
</tr>
<tr>
<td>&emsp;&emsp;<a href="#learning-engagement">2.4.5. Learning Engagement</a></td>
<td></td>
</tr>
<tr><td colspan="2">&emsp;<a href="#learning-assessment">2.5. Learning Assessment</a></td></tr>
<tr>
<td>&emsp;&emsp;<a href="#adaptive-testing">2.5.1. Adaptive Testing</a></td>
<td>&emsp;&emsp;<a href="#automated-grading">2.5.2. Automated Grading</a></td>
</tr>
<tr><td colspan="2"><strong><a href="#application-domains">3. Application Domains</a></strong></td></tr>
<tr><td colspan="2">&emsp;<a href="#computer-science">3.1. Computer Science</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#mathematics">3.2. Mathematics</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#language-learning">3.3. Language Learning</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#medical-education">3.4. Medical Education</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#humanities">3.5. Humanities</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#social-good">3.6. Social Good</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#social-skills">3.7. Social Skills</a></td></tr>
<tr><td colspan="2"><strong><a href="#datasets-benchmarks-toolkits">4. Datasets, Benchmarks & Toolkits</a></strong></td></tr>
<tr><td colspan="2">&emsp;<a href="#datasets">4.1. Datasets</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#benchmarks">4.2. Benchmarks</a></td></tr>
<tr><td colspan="2">&emsp;<a href="#toolkits">4.3. Toolkits</a></td></tr>
</table>

## [Surveys, Analyses & Perspectives](#content)

### [Comprehensive Surveys](#content)

1. :sparkles: **The Path to Conversational AI Tutors: Integrating Tutoring Best Practices and Targeted Technologies to Produce Scalable AI Agents**

    *Kirk Vanacore, Ryan S. Baker, Avery H. Closser, Jeremy Roschelle*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.19303)

2. :sparkles: **Generative Artificial Intelligence and Agents in Research and Teaching**

    *Jussi S. Jauhiainen, Aurora Toppari*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2508.16701)

3. :sparkles: **Opportunities and Challenges of LLMs in Education: An NLP Perspective**

    *Sowmya Vajjala, Bashar Alhafni, Stefano Bannò, Kaushal Kumar Maurya, Ekaterina Kochmar*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2507.22753)

4. :sparkles: **Large Language Models for Education: A Survey**

    *Hanyi Xu, Wensheng Gan, Zhenlian Qi, Jiayang Wu, Philip S. Yu*

    Journal of Machine Learning and Cybernetics, 2024. [`journal`](https://arxiv.org/abs/2405.13001)

5. :sparkles: **Adapting Large Language Models for Education: Foundational Capabilities, Potentials, and Challenges**

    *Qingyao Li, Lingyue Fu, Weiming Zhang, Xianyu Chen, Jingwei Yu, Wei Xia, Weinan Zhang, Ruiming Tang, Yong Yu*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2401.08664)

6. :sparkles: **Large Language Models for Education: A Survey and Outlook**

    *Shen Wang, Tianlong Xu, Hang Li, Chaoli Zhang, Joleen Liang, Jiliang Tang, Philip S. Yu, Qingsong Wen*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2403.18105)

7. :sparkles: **Large Language Models in Education: Vision and Opportunities**

    *Wensheng Gan, Zhenlian Qi, Jiayang Wu, Jerry Chun-Wei Lin*

    BigData, 2023. [`conference`](https://arxiv.org/abs/2311.13160)

### [Empirical Analyses](#content)

1. :sparkles: **The effect of ChatGPT on students’ learning performance, learning perception, and higher-order thinking: insights from a meta-analysis**

    *Jin Wang, Wenxiang Fan*

    Nature, 2025. [`journal`](https://www.nature.com/articles/s41599-025-04787-y)

2. :sparkles: **From Pilots to Practices: A Scoping Review of GenAI-Enabled Personalization in Computer Science Education**

    *Iman Reihanian, Yunfei Hou, Qingquan Sun*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.20714)

3. :sparkles: **A systematic review of AI-driven intelligent tutoring systems (ITS) in K-12 education**

    *Angélique Létourneau, Marion Deslandes Martineau, Patrick Charland, John Alexander Karran, Jared Boasen, Pierre Majorique Léger*

    npj science of learning, 2025. [`journal`](https://www.nature.com/articles/s41539-025-00320-7)


## [Teaching & Learning Lifecycle](#content)

### [Tutoring Systems](#content)

#### [General Tutoring](#content)

1. :sparkles: **Beyond Pedagogical Principles: Multi-Horizon Preference Optimization for Efficient Socratic Tutoring**

    *Xin Shi, Chao Zhang, Yifan Zhu, Xueqiao Zhang, Yawei Luo*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.518/)

2. :sparkles: **LearnerCoMPASS: Intelligent Tutoring System with Dynamic Cognitive Diagnosis and Multi-Model Path Planning**

    *Ziji Sheng, Guiyao Tie, Weidong Wang, Pan Zhou, Daizong Liu*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.408/)

3. :sparkles: **Planning-Guided Tutoring with Assessment-Driven Memory for Pedagogical LLM Tutors**

    *Zechen Li, Qiannan Zhu, Mei Wang, Jia Li, Hua Huang*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.325/)

4. :sparkles: **SHAPE: Unifying Safety, Helpfulness and Pedagogy for Educational LLMs**

    *Sihang Zhao, Kangrui Yu, Youliang Yuan, Pinjia He, Hongyi Wen*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.529/)

5. :sparkles: **CogNet-KG: Empowering Tutoring Dialogues with a Cognitively-Structured Knowledge Graph for STEM Learning**

    *Ding Yu, Yu Lu, Tengju Li, Shasha Xiong, Shengquan Yu*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.639/)

6. :sparkles: **Arapai: An Offline-First AI Chatbot Architecture for Low-Connectivity Educational Environments**

    *Joseph Walusimbi, Ann Move Oguti, Joshua Benjamin Ssentongo, Keith Ainebyona*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2603.03339)

7. :sparkles: **ClassAid: A Real-time Instructor-AI-Student Orchestration System for Classroom Programming Activities**

    *Gefei Zhang, Guodao Sun, Meng Xia, Ronghua Liang*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.06734)

8. :sparkles: **Designing AI Tutors for Interest-Based Learning: Insights from Human Instructors**

    *Abhishek Kulkarni, Sharon Lynn Chu*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.24036)

9. :sparkles: **Evidence-Decision-Feedback: Theory-Driven Adaptive Scaffolding for LLM Agents**

    *Clayton Cohn, Siyuan Guo, Surya Rayala, Hanchen David Wang, Naveeduddin Mohammed, Umesh Timalsina, Shruti Jain, Angela Eeds, Menton Deweese, Pamela J. Osborn Popp, Rebekah Stanton, Shakeera Walker, Meiyi Ma, Gautam Biswas*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.01415)

10. :sparkles: **Letting Tutor Personas Speak Up for LLMs: Learning Steering Vectors from Dialogue via Preference Optimization**

    *Jaewook Lee, Alexander Scarlatos, Simon Woodhead, Andrew Lan*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.07639)

11. :sparkles: **PATS: Personality-Aware Teaching Strategies with Large Language Model Tutors**

    *Donya Rooein, Sankalan Pal Chowdhury, Mariia Eremeeva, Yuan Qin, Debora Nozza, Mrinmaya Sachan, Dirk Hovy*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.08402)

12. :sparkles: **Rewarding How Models Think Pedagogically: Integrating Pedagogical Reasoning and Thinking Rewards for LLMs in Education**

    *Unggi Lee, Jiyeong Bae, Jaehyeon Park, Haeun Park, Taejun Park, Younghoon Jeon, Sungmin Cho, Junbo Koh, Yeil Jeong, Gyeonggeon Lee*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.14560)

13. :sparkles: **LLM-powered Multi-agent Framework for Goal-oriented Learning in Intelligent Tutoring System**

    *Tianfu Wang, Yi Zhan, Jianxun Lian, Zhengyu Hu, Nicholas Jing Yuan, Qi Zhang, Xing Xie, Hui Xiong*

    WWW, 2025. [`conference`](https://arxiv.org/abs/2501.15749), [`code`](https://github.com/GeminiLight/gen-mentor)

14. :sparkles: **A Theory of Adaptive Scaffolding for LLM-Based Pedagogical Agents**

    *Clayton Cohn, Surya Rayala, Namrata Srivastava, Joyce Horn Fonteles, Shruti Jain, Xinying Luo, Divya Mereddy, Naveeduddin Mohammed, Gautam Biswas*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2508.01503)

15. :sparkles: **AI tutoring can safely and effectively support students: An exploratory RCT in UK classrooms**

    *LearnLM Team, Eedi*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.23633)

16. :sparkles: **AgentTutor: Empowering Personalized Learning with Multi-Turn Interactive Teaching in Intelligent Education Systems**

    *Yuxin Liu, Zeqing Song, Jiong Lou, Chentao Wu, Jie Li*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2601.04219)

17. :sparkles: **An Experience Report on a Pedagogically Controlled Curriculum-Constrained AI Tutor for SE Education**

    *Lucia Happe, Dominik Fuchs, Luca Huttner, Kai Marquardt, Anne Koziolek*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.11882)

18. :sparkles: **Cultivating Helpful, Personalized, and Creative AI Tutors: A Framework for Pedagogical Alignment using Reinforcement Learning**

    *Siyu Song, Wentao Liu, Ye Lu, Ruohua Zhang, Tao Liu, Jinze Lv, Xinyun Wang, Aimin Zhou, Fei Tan, Bo Jiang, Hao Hao*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2507.20335)

19. :sparkles: **Evolutionary Reinforcement Learning based AI tutor for Socratic Interdisciplinary Instruction**

    *Mei Jiang, Haihai Shen, Zhuo Luo, Bingdong Li, Wenjing Hong, Ke Tang, Aimin Zhou*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.11930)

20. :sparkles: **Exploring Conversational Design Choices in LLMs for Pedagogical Purposes: Socratic and Narrative Approaches for Improving Instructor's Teaching Practice**

    *Si Chen, Isabel R. Molnar, Peiyu Li, Adam Acunin, Ting Hua, Alex Ambrose, Nitesh V. Chawla, Ronald Metoyer*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2501.04100)

21. :sparkles: **From Problem-Solving to Teaching Problem-Solving: Aligning LLMs with Pedagogy using Reinforcement Learning**

    *David Dinucu-Jianu, Jakub Macina, Nico Daheim, Ido Hakimi, Iryna Gurevych, Mrinmaya Sachan*

    arXiv, 2025. [`preprint`](https://arxiv.org/pdf/2505.15607), [`code`](https://github.com/eth-lre/PedagogicalRL)

22. :sparkles: **Generative AI in Education: From Foundational Insights to the Socratic Playground for Learning**

    *Xiangen Hu, Sheng Xu, Richard Tong, Art Graesser*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2501.06682)

23. :sparkles: **Hierarchical Pedagogical Oversight: A Multi-Agent Adversarial Framework for Reliable AI Tutoring**

    *Saisab Sadhu, Ashim Dhor*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.22496)

24. :sparkles: **IntelliCode: A Multi-Agent LLM Tutoring System with Centralized Learner Modeling**

    *Jones David, Shreya Ghosh*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.18669)

25. :sparkles: **LeafTutor: An AI Agent for Programming Assignment Tutoring**

    *Madison Bochard, Tim Conser, Alyssa Duran, Lazaro Martull, Pu Tian, Yalong Wu*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2601.02375)

26. :sparkles: **Empowering Personalized Learning through a Conversation-based Tutoring System with Student Modeling**

    *Minju Park, Sojung Kim, Seunghyun Lee, Soonwoo Kwon, Kyuseok Kim*

    CHI-LBW, 2024. [`workshop`](https://arxiv.org/abs/2403.14071)

27. :sparkles: **AutoTutor meets Large Language Models: A Language Model Tutor with Rich Pedagogy and Guardrails**

    *Sankalan Pal Chowdhury, Vilém Zouhar, Mrinmaya Sachan*

    Learning@Scale, 2024. [`conference`](https://arxiv.org/abs/2402.09216)

28. :sparkles: **Multi-turn Reinforcement Learning with Preference Human Feedback**

    *Lior Shani, Aviv Rosenberg, Asaf Cassel, Oran Lang, Daniele Calandriello, Avital Zipori, Hila Noga, Orgad Keller, Bilal Piot, Idan Szpektor, Avinatan Hassidim, Yossi Matias, Rémi Munos*

    NeurIPS, 2024. [`conference`](https://proceedings.neurips.cc/paper_files/paper/2024/hash/d77a7b289361abff82bdd2fb537ae152-Abstract-Conference.html)

29. :sparkles: **SocraticLM: Exploring Socratic Personalized Teaching with Large Language Models**

    *Jiayu Liu, Zhenya Huang, Tong Xiao, Jing Sha, Jinze Wu, Qi Liu, Shijin Wang, Enhong Chen*

    NeurIPS, 2024. [`conference`](https://neurips.cc/virtual/2024/poster/93477)

30. :sparkles: **Apprentice Tutor Builder: A Platform For Users to Create and Personalize Intelligent Tutors**

    *Glen Smith, Adit Gupta, Christopher MacLellan*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2404.07883)

31. :sparkles: **Intelligent Tutor: Leveraging ChatGPT and Microsoft Copilot Studio to Deliver a Generative AI Student Support and Feedback System within Teams**

    *Wei-Yu Chen*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2404.06762)

32. :sparkles: **Scaffolding Language Learning via Multi-modal Tutoring Systems with Pedagogical Instructions**

    *Zhengyuan Liu, Stella Xin Yin, Carolyn Lee, Nancy F. Chen*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2404.03429)

33. :sparkles: **AI-TA: Towards an Intelligent Question-Answer Teaching Assistant using Open-Source LLMs**

    *Yann Hicke, Anmol Agarwal, Qianou Ma, Paul Denny*

    NeurIPS - Workshop on Generative AI for Education (GAIED), 2023. [`workshop`](https://arxiv.org/abs/2311.02775)

34. :sparkles: **Empowering Private Tutoring by Chaining Large Language Models**

    *Yulin Chen, Ning Ding, Hai-Tao Zheng, Zhiyuan Liu, Maosong Sun, Bowen Zhou*

    arXiv, 2023. [`preprint`](https://arxiv.org/abs/2309.08112)

35. :sparkles: **How to Build an AI Tutor that Can Adapt to Any Course and Provide Accurate Answers Using Large Language Model and Retrieval-Augmented Generation**

    *Chenxi Dong*

    arXiv, 2023. [`preprint`](https://arxiv.org/abs/2311.17696)

#### [Learning Path Recommendation](#content)

1. :sparkles: **Multi-Agent Learning Path Planning via LLMs**

    *Haoxin Xu, Changyong Qi, Tong Liu, Bohao Zhang, Anna He, Bingqian Jiang, Longwei Zheng, Xiaoqing Gu*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.17346)

2. :sparkles: **LearnMate: Enhancing Online Education with LLM-Powered Personalized Learning Plans and Support**

    *Xinyu Jessica Wang, Christine P. Lee, Bilge Mutlu*

    CHI Extended Abstract, 2025. [`workshop`](https://arxiv.org/abs/2503.13340)

3. :sparkles: **PlanGlow: Personalized Study Planning with an Explainable and Controllable LLM-Driven System**

    *Jiwon Chun, Yankun Zhao, Hanlin Chen, Meng Xia*

    Learning@Scale, 2025. [`conference`](https://arxiv.org/abs/2504.12452)

4. :sparkles: **Knowledge Starts with Practice: Knowledge-Aware Exercise Generative Recommendation with Adaptive Multi-Agent Cooperation**

    *Yangtao Zhou, Hua Chu, Yongxiang Chen, Ziwen Wang, Jiacheng Liu, Jianan Li, Yueying Feng, Xiangming Li, Zihan Han, Qingshan Li*

    NeurIPS, 2025. [`conference`](https://proceedings.neurips.cc/paper_files/paper/2025/hash/85dbd2fb8b355e4231b51e454c08ec1c-Abstract-Conference.html), [`code`](https://github.com/dsz532/exeGen)

5. :sparkles: **Learning Structure and Knowledge Aware Representation with Large Language Models for Concept Recommendation**

    *Qingyao Li, Wei Xia, Kounianhua Du, Qiji Zhang, Weinan Zhang, Ruiming Tang, Yong Yu*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2405.12442)

### [Material Preparation](#content)

#### [Content Generation](#content)

1. :sparkles: **KCVR: Knowledge-Centric Video Reconstruction for Structured Pedagogical Summarization via Dynamic Graph Planning**

    *Jingjiang Liu, Jia Zhu, Hanghui Guo, Weijie Shi, Yue Cui, Xiaokang Jin, Yilin Wang, Qingyu Niu, Jiawei Shen, Guoqing Ma, Yidan Liang, Shimin Di, Jiajie Xu*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.414/)

2. :sparkles: **Code2Video: A Code-centric Paradigm for Educational Video Creation**

    *Yanzhe Chen, Kevin Qinghong Lin, Mike Zheng Shou*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=HJ0JFzdwUo)

3. :sparkles: **ConvoLearn: A Dataset of Constructivist Tutor-Student Dialogue**

    *Mayank Sharma, Roy Pea, Hari Subramonyam*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.08950)

4. :sparkles: **The Reel Deal: Designing and Evaluating LLM-Generated Short-Form Educational Videos**

    *Lazaros Stavrinou, Argyris Constantinides, Marios Belk, Vasos Vassiliou, Fotis Liarokapis, Marios Constantinides*

    CHIGreece, 2025. [`conference`](https://arxiv.org/abs/2501.04101)

5. :sparkles: **HealthCards: Exploring Text-to-Image Generation as Visual Aids for Healthcare Knowledge Democratizing and Education**

    *Qian Wu, Zheyao Gao, Longfei Gou, Yifan Hou, Qi Dou*

    EMNLP, 2025. [`conference`](https://aclanthology.org/2025.emnlp-main.1401/)

6. :sparkles: **Classic4Children: Adapting Chinese Literary Classics for Children with Large Language Model**

    *Jiali Chen, Xusen Hei, Yuqi Xue, Zihan Wu, Jiayuan Xie, Yi Cai*

    NAACL Findings, 2025. [`conference`](https://arxiv.org/abs/2502.01090)

7. :sparkles: **COGENT: A Curriculum-oriented Framework for Generating Grade-appropriate Educational Content**

    *Zhengyuan Liu, Stella Xin Yin, Dion Hoe-Lian Goh, Nancy F. Chen*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2409.15024)

8. :sparkles: **Assisting in Writing Wikipedia-like Articles From Scratch with Large Language Models**

    *Yijia Shao, Yucheng Jiang, Theodore A. Kanell, Peter Xu, Omar Khattab, Monica S. Lam*

    NAACL, 2024. [`conference`](https://arxiv.org/abs/2402.14207)

9. :sparkles: **Generating and Evaluating Tests for K-12 Students with Language Model Simulations: A Case Study on Sentence Reading Efficiency**

    *Eric Zelikman, Wanjing Anya Ma, Jasmine E. Tran, Diyi Yang, Jason D. Yeatman, Nick Haber*

    EMNLP, 2023. [`conference`](https://arxiv.org/abs/2310.06837)

10. :sparkles: **On the Automatic Generation and Simplification of Children's Stories**

    *Maria Valentini, Jennifer Weber, Jesus Salcido, Téa Wright, Eliana Colunga, Katharina Kann*

    EMNLP, 2023. [`conference`](https://arxiv.org/abs/2310.18502)

11. :sparkles: **FairytaleCQA: Integrating a Commonsense Knowledge Graph into Children's Storybook Narratives**

    *Jiaju Chen, Yuxuan Lu, Shao Zhang, Bingsheng Yao, Yuanzhe Dong, Ying Xu, Yunyao Li, Qianwen Wang, Dakuo Wang, Yuling Su*

    arXiv, 2023. [`preprint`](https://arxiv.org/abs/2311.09756)

12. :sparkles: **Robosourcing Educational Resources – Leveraging Large Language Models for Learnersourcing**

    *Paul Denny, Sami Sarsa, Arto Hellas, Juho Leinonen*

    Learning@Scale - Workshop on Learnersourcing: Student-generated Content @ Scale, 2022. [`workshop`](https://arxiv.org/abs/2211.04715)

#### [Question Generation](#content)

1. :sparkles: **From Memorization to Creation: Evaluating the Cognitive Depth of LLM-Generated Educational Questions**

    *Xiaolong Wang, Zhe Zhao, Song Lai, Chaoli Zhang, Zijie Geng, Yu Tong, Ye Wei, Qingsong Wen*

    KDD, 2026. [`conference`](https://arxiv.org/abs/2606.18257)

2. :sparkles: **LLM Prompt Evaluation for Educational Applications**

    *Langdon Holmes, Adam Coscia, Scott Crossley, Joon Suh Choi, Wesley Morris*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.16134)

3. :sparkles: **Exploring Iterative Enhancement for Improving Learnersourced Multiple-Choice Question Explanations with Large Language Models**

    *Qiming Bao, Juho Leinonen, Alex Yuxuan Peng, Wanjun Zhong, Gaël Gendron, Timothy Pistotti, Alice Huang, Paul Denny, Michael Witbrock, Jiamou Liu*

    AAAI, 2025. [`conference`](https://arxiv.org/abs/2309.10444)

4. :sparkles: **Multiple-Choice Question Generation Using Large Language Models: Methodology and Educator Insights**

    *Giorgio Biancini, Alessio Ferrato, Carla Limongelli*

    UMAP Adjunct, 2025. [`workshop`](https://arxiv.org/abs/2506.04851)

5. :sparkles: **KAQG: A Knowledge‑Graph‑Enhanced RAG for Difficulty‑Controlled Question Generation**

    *Ching Han Chen, Ming Fang Shiu*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2505.07618)

6. :sparkles: **Math Multiple Choice Question Generation via Human-Large Language Model Collaboration**

    *Jaewook Lee, Digory Smith, Simon Woodhead, Andrew Lan*

    EDM, 2024. [`conference`](https://arxiv.org/abs/2405.00864)

7. :sparkles: **Improving Automated Distractor Generation for Math Multiple-choice Questions with Overgenerate-and-rank**

    *Alexander Scarlatos, Wanyong Feng, Digory Smith, Simon Woodhead, Andrew Lan*

    NAACL - BEA workshop, 2024. [`workshop`](https://arxiv.org/abs/2405.05144)

8. :sparkles: **Exploring Automated Distractor Generation for Math Multiple-choice Questions via Large Language Models**

    *Wanyong Feng, Jaewook Lee, Hunter McNichols, Alexander Scarlatos, Digory Smith, Simon Woodhead, Nancy Otero Ornelas, Andrew Lan*

    NAACL Findings, 2024. [`conference`](https://arxiv.org/abs/2404.02124)

9. :sparkles: **Leveraging Large Language Models for Concept Graph Recovery and Question Answering in NLP Education**

    *Rui Yang, Boming Yang, Sixun Ouyang, Tianwei She, Aosong Feng, Yuang Jiang, Freddy Lecue, Jinghui Lu, Irene Li*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2402.14293)

10. :sparkles: **Multiple Choice Questions and Large Languages Models: A Case Study with Fictional Medical Data**

    *Maxime Griot, Jean Vanderdonckt, Demet Yuksel, Coralie Hemptinne*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2406.02394)

#### [Knowledge Structuring](#content)

1. :sparkles: **CSG: Cognitive Structure Generation for Intelligent Education**

    *Hengnian Gu, Zhifu Chen, Yuxin Chen, Jin Zhou, Dongdai Zhou*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=PfarHkQG8e)

2. :sparkles: **Instructor-Aligned Knowledge Graphs for Personalized Learning**

    *Abdulrahman AlRabah, Priyanka Kargupta, Jiawei Han, Abdussalam Alawini*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.17111)

#### [Resource Retrieval](#content)

1. :sparkles: **Large Language Model Augmented Exercise Retrieval for Personalized Language Learning**

    *Austin Xu, Will Monroe, Klinton Bicknell*

    Learning Analytics and Knowledge (LAK), 2024. [`conference`](https://arxiv.org/abs/2402.16877)

#### [Instructional Design](#content)

1. :sparkles: **Instructional Agents: LLM Agents Can Reduce Teaching Faculty Workload through Multi-Agent Instructional Design**

    *Huaiyuan Yao, Wanpeng Xu, Justin Turnau, Nadia Kellam, Hua Wei*

    EACL, 2026. [`conference`](https://arxiv.org/abs/2508.19611), [`code`](https://github.com/DaRL-GenAI/instructional_agents)

2. :sparkles: **COMA: A Collaborative Multi-Role Agent Framework for Automated Lesson Plan Generation**

    *Xiaoli Zeng, Ying Zheng, Shuyan Huang, Zitao Liu, Mi Tian, Mingliang Hou, Jiaqi Zheng, Wenzhou Dou*

    WWW, 2026. [`conference`](https://doi.org/10.1145/3774904.3792982), [`code`](https://github.com/ai4ed/COMA-LessonPlan)

### [Teaching Support](#content)

#### [Teaching Assistance](#content)

1. :sparkles: **Double-Edged Sword or Sharp Tool? Designing and Evaluating Triadic LLM-Teacher Collaboration for K-12 Writing at Scale**

    *Canran WANG, Yuwen Yang, Zhen Wang, Ming MA, Ding Yu, Chentai Wang, Keman Huang, Xiaoyong Du*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.597/)

2. :sparkles: **Co-designing Large Language Model Tools for Project-Based Learning with K-12 Educators**

    *Prerna Ravi, John Masla, Gisella Kakoti, Grace Lin, Emma Anderson, Matt Taylor, Anastasia Ostrowski, Cynthia Breazeal, Eric Klopfer, Hal Abelson*

    CHI, 2025. [`conference`](https://arxiv.org/abs/2502.09799)

3. :sparkles: **LLMs are Biased Teachers: Evaluating LLM Bias in Personalized Education**

    *Iain Weissburg, Sathvika Anand, Sharon Levy, Haewon Jeong*

    NAACL Findings, 2025. [`conference`](https://aclanthology.org/2025.findings-naacl.314/)

4. :sparkles: **A Humanoid Social Robot as a Teaching Assistant in the Classroom**

    *Thomas Sievers*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2508.05646)

5. :sparkles: **Supporting Self-Reflection at Scale with Large Language Models: Insights from Randomized Field Experiments in Classrooms**

    *Harsh Kumar, Ruiwei Xiao, Benjamin Lawson, Ilya Musabirov, Jiakai Shi, Xinyuan Wang, Huayin Luo, Joseph Jay Williams, Anna Rafferty, John Stamper, Michael Liut*

    Learning@Scale, 2024. [`conference`](https://arxiv.org/abs/2406.07571)

6. :sparkles: **The Promises and Pitfalls of Using Language Models to Measure Instruction Quality in Education**

    *Paiheng Xu, Jing Liu, Nathan Jones, Julie Cohen, Wei Ai*

    NAACL, 2024. [`conference`](https://arxiv.org/abs/2404.02444)

7. :sparkles: **MathVC: An LLM-Simulated Multi-Character Virtual Classroom for Mathematics Education**

    *Murong Yue, Wijdane Mifdal, Yixuan Zhang, Jennifer Suh, Ziyu Yao*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2404.06711)

8. :sparkles: **Simulating Classroom Education with LLM-Empowered Agents**

    *Zheyuan Zhang, Daniel Zhang-Li, Jifan Yu, Linlu Gong, Jinchang Zhou, Zhanxin Hao, Jianxiao Jiang, Jie Cao, Huiqin Liu, Zhiyuan Liu, Lei Hou, Juanzi Li*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2406.19226)

### [Learner Modeling](#content)

#### [Knowledge Tracing](#content)

1. :sparkles: **RAG-KT: Cross-platform Explainable Knowledge Tracing with Multi-view Fusion Retrieval Generation**

    *Zhiyi Duan, Hongyu Yuan, Rui Liu*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.257/)

2. :sparkles: **Leveraging LLM and Multiscale Knowledge States to Improve Knowledge Tracing in Programming Tasks**

    *Mingxing Shao, Tiancheng Zhang, Yifang Yin, Wenhui Wu, Zikai Li, Minghe Yu, Fangling Leng, Ge Yu*

    WWW, 2026. [`conference`](https://doi.org/10.1145/3774904.3792525)

3. :sparkles: **A Training-Free Large Reasoning Model-based Knowledge Tracing Framework for Unified Prediction and Prescription**

    *Unggi Lee, Joo Young Kim, Ran Ju, Minyoung Jung, Jeyeon Eo*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.01708)

4. :sparkles: **Towards LLM-Empowered Knowledge Tracing via LLM-Student Hierarchical Behavior Alignment in Hyperbolic Space**

    *Xingcheng Fu, Shengpeng Wang, Yisen Gao, Xianxian Li, Chunpei Li, Qingyun Sun, Dongran Yu*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.22879)

5. :sparkles: **PICKT: Practical Interlinked Concept Knowledge Tracing for Personalized Learning using Knowledge Map Concept Relations**

    *Wonbeen Lee, Channyoung Lee, Junho Sohn, Hansam Cho*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.07179)

6. :sparkles: **Problems With Large Language Models for Learner Modelling: Why LLMs Alone Fall Short for Responsible Tutoring in K--12 Education**

    *Danial Hooshyar, Yeongwook Yang, Gustav Sir, Tommi Karkkainen, Raija Hamalainen, Mutlu Cukurova, Roger Azevedo*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.23036)

#### [Cognitive Diagnosis](#content)

1. :sparkles: **Multi-Agent Debate based Concept Augmentation for Enhanced Cognitive Diagnosis**

    *Pengyang Shao, Lei Chen, Fei Liu, Yonghui Yang, Xun Yang, Meng Wang*

    KDD, 2026. [`conference`](https://doi.org/10.1145/3770854.3780196)

2. :sparkles: **Harnessing LLM for Noise-Robust Cognitive Diagnosis in Web-Based Intelligent Education Systems**

    *Guixian Zhang, Guan Yuan, Ziqi Xu, Yanmei Zhang, Jing Ren, Zhenyun Deng, Debo Cheng*

    WWW, 2026. [`conference`](https://doi.org/10.1145/3774904.3792493)

3. :sparkles: **ALIGNAgent: Adaptive Learner Intelligence for Gap Identification and Next-step guidance**

    *Bismack Tokoli, Luis Jaimes, Ayesha S. Dina*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.15551)

4. :sparkles: **Misconception Diagnosis From Student-Tutor Dialogue: Generate Retrieve Rerank**

    *Joshua Mitton, Prarthana Bhattacharyya, Digory Smith, Thomas Christie, Ralph Abboud, Simon Woodhead*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.02414)

5. :sparkles: **Knowledge Is Power: Harnessing Large Language Models for Enhanced Cognitive Diagnosis**

    *Zhiang Dong, Jingyuan Chen, Fei Wu*

    AAAI, 2025. [`conference`](https://ojs.aaai.org/index.php/AAAI/article/view/31992)

6. :sparkles: **Generative Students: Using LLM-Simulated Student Profiles to Support Question Item Evaluation**

    *Xinyi Lu, Xu Wang*

    Learning@Scale, 2024. [`conference`](https://arxiv.org/abs/2405.11591)

#### [Student Profiling](#content)

1. :sparkles: **FOKE: A Personalized and Explainable Education Framework Integrating Foundation Models, Knowledge Graphs, and Prompt Engineering**

    *Silan Hu, Xiaoning Wang*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2405.03734)

2. :sparkles: **Contextualizing Problems to Student Interests at Scale in Intelligent Tutoring System Using Large Language Models**

    *Gautam Yadav, Ying-Jui Tseng, Xiaolin Ni*

    AIED - Workshop on Empowering Education with LLMs - the Next-Gen Interface and Content Generation, 2023. [`workshop`](https://arxiv.org/abs/2306.00190)

#### [Student Simulation](#content)

1. :sparkles: **One LLM Does Not Simulate All Students: Ability-Aware Student Simulation via Cognitive Diagnosis Guided LLM Assignment**

    *Huixing Que, Qi Liu, Weibo Gao, Zhenya Huang*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.302/)

2. :sparkles: **EduMirror: Modeling Educational Social Dynamics with Value-driven Multi-agent Simulation**

    *Jingzhe Lin, Hengbin Yu, Yongdan Zeng, Fangwei Zhong*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=9CPlmQzUtF)

3. :sparkles: **KASER: Knowledge-Aligned Student Error Simulator for Open-Ended Coding Tasks**

    *Zhangqi Duan, Nigel Fernandez, Andrew Lan*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.06633)

4. :sparkles: **Simulated Students in Tutoring Dialogues: Substance or Illusion?**

    *Alexander Scarlatos, Jaewook Lee, Simon Woodhead, Andrew Lan*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.04025)

5. :sparkles: **Towards Valid Student Simulation with Large Language Models**

    *Zhihao Yuan, Yunze Xiao, Ming Li, Weihao Xuan, Richard Tong, Mona Diab, Tom Mitchell*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.05473)

6. :sparkles: **Agent4Edu: Generating Learner Response Data by Generative Agents for Intelligent Education Systems**

    *Weibo Gao, Qi Liu, Linan Yue, Fangzhou Yao, Rui Lv, Zheng Zhang, Hao Wang, Zhenya Huang*

    AAAI, 2025. [`conference`](https://arxiv.org/abs/2501.10332)

7. :sparkles: **Classroom Simulacra: Building Contextual Student Generative Agents in Online Education for Learning Behavioral Simulation**

    *Songlin Xu, Hao-Ning Wen, Hongyi Pan, Dallas Dominguez, Dong yin Hu, Xinyu Zhang*

    CHI, 2025. [`conference`](https://arxiv.org/abs/2502.02780)

8. :sparkles: **Evolution in Simulation: AI-Agent School with Dual Memory for High-Fidelity Educational Dynamics**

    *Sheng Jin, Haoming Wang, Zhiqi Gao, Yongbo Yang, Bao Chunjia, Chengliang Wang*

    EMNLP Findings, 2025. [`conference`](https://arxiv.org/abs/2510.11290)

9. :sparkles: **CoderAgent: Simulating Student Behavior for Personalized Programming Learning with Large Language Models**

    *Yi Zhan, Qi Liu, Weibo Gao, Zheng Zhang, Tianfu Wang, Shuanghong Shen, Junyu Lu, Zhenya Huang*

    IJCAI, 2025. [`conference`](https://arxiv.org/abs/2505.20642)

10. :sparkles: **Personality-aware Student Simulation for Conversational Intelligent Tutoring Systems**

    *Zhengyuan Liu, Stella Xin Yin, Geyu Lin, Nancy F. Chen*

    EMNLP, 2024. [`conference`](https://aclanthology.org/2024.emnlp-main.37/)

11. :sparkles: **EduAgent: Generative Student Agents in Learning**

    *Songlin Xu, Xinyu Zhang, Lianhui Qin*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2404.07963)

#### [Learning Engagement](#content)

1. :sparkles: **Everyone's using it but no one is allowed to talk about it: College Students' Experiences Navigating the Higher Education Environment in a Generative AI World**

    *Yue Fu, Yifan Lin, Yessica Wang, Sarah Tran, Alexis Hiniker*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.17720)

2. :sparkles: **GuideAI: A Real-time Personalized Learning Solution with Adaptive Interventions**

    *Ananya Shukla, Chaitanya Modi, Satvik Bajpai, Siddharth Siddharth*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.20402)

3. :sparkles: **Investigating Self-regulated Learning Sequences within a Generative AI-based Intelligent Tutoring System**

    *Jie Gao, Shasha Li, Jianhua Zhang, Shan Li, Tingting Wang*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.17000)

4. :sparkles: **Same Feedback Different Source: How AI vs Human Feedback Shapes Learner Engagement**

    *Caitlin Morris, Pattie Maes*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.11311)

5. :sparkles: **StoryLensEdu: Personalized Learning Report Generation through Narrative-Driven Multi-Agent Systems**

    *Leixian Shen, Yan Luo, Rui Sheng, Yujia He, Haotian Li, Leni Yang, Huamin Qu*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.17067)

6. :sparkles: **Examining the Role of LLM-Driven Interactions on Attention and Cognitive Engagement in Virtual Classrooms**

    *Suleyman Ozdel, Can Sarpkaya, Efe Bozkir, Hong Gao, Enkelejda Kasneci*

    arXiv, 2025. [`preprint`](https://arxiv.org/pdf/2505.07377)

7. :sparkles: **Exploring The Interaction-Outcome Paradox: Seemingly Richer and More Self-Aware Interactions with LLMs May Not Yet Lead to Better Learning**

    *Rahul R. Divekar, Sophia Guerra, Lisette Gonzalez, Natasha Boos*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2511.09458)

### [Learning Assessment](#content)

#### [Adaptive Testing](#content)

1. :sparkles: **Efficient Adaptive Testing via Gradient Path Matching Subset Selection for AI Education**

    *Yan Zhuang, Junhao Yu, Bohou Zhang, Zachary Pardos, Jinze Wu, Daoqiang Zhang*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=XnK6Jr0i8D)

#### [Automated Grading](#content)

1. :sparkles: **EduMARS: Can Vision-Language Models Grade Like Teachers? Benchmarking Multimodal, Rubric-Based Assessment on Chinese K-12 Answers**

    *Xuan Zhao, Jiashun Chen, Wanting xu, Huiyuan Yan, Chaowei Fang, Xing Wei*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.466/)

2. :sparkles: **FeedEval: Pedagogically Aligned Evaluation of LLM-Generated Essay Feedback**

    *Seongyeub Chu, Jongwoo Kim, Munyong Yi*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.615/)

3. :sparkles: **From Scoring to Explanations: Evaluating SHAP and LLM Rationales for Rubric-based Teaching Quality Assessment**

    *Ivo Bueno, Babette Bühler, Philipp Stark, Tim Fütterer, Ulrich Trautwein, Dorottya Demszky, Heather Hill, Enkelejda Kasneci*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.375/)

4. :sparkles: **PsyScore: A Psychometrically-Aware Framework for Trait-Adaptive Essay Scoring and ZPD-Scaffolded Feedback**

    *Wei Xia, Jin Wu, Haoran Shi, Xiangyu Wang, Chanjin Zheng*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.384/)

5. :sparkles: **Evaluating AI Grading on Real-World Handwritten College Mathematics: A Large-Scale Study Toward a Benchmark**

    *Zhiqi Yu, Xingping Liu, Haobin Mao, Mingshuo Liu, Long Chen, Jack Xin, Yifeng Yu*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=vcdsMrNGqP)

6. :sparkles: **TRACE: Toulmin-based Reasoning Assessment through Constructive Elements for LLM CoT Evaluation**

    *Yundong Kim, Heyoung Yang*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=NJ9MZkCLAG)

7. :sparkles: **Automated Feedback Generation for Undergraduate Mathematics: Development and Evaluation of an AI Teaching Assistant**

    *Aron Gohr, Marie-Amelie Lawn, Kevin Gao, Inigo Serjeant, Stephen Heslip*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.03458)

8. :sparkles: **How Uncertain Is the Grade? A Benchmark of Uncertainty Metrics for LLM-Based Automatic Assessment**

    *Hang Li, Kaiqi Yang, Xianxuan Long, Fedor Filippov, Yucheng Chu, Yasemin Copur-Gencturk, Peng He, Cory Miller, Namsoo Shin, Joseph Krajcik, Hui Liu, Jiliang Tang*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.16039)

9. :sparkles: **Machine-Assisted Grading of Nationwide School-Leaving Essay Exams with LLMs and Statistical NLP**

    *Andres Karjus, Kais Allkivi, Silvia Maine, Katarin Leppik, Krister Kruusmaa, Merilin Aruvee*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.16314)

10. :sparkles: **Conversational Education at Scale: A Multi-LLM Agent Workflow for Procedural Learning and Pedagogic Quality Assessment**

    *Jiahuan Pei, Fanghua Ye, Xin Sun, Wentao Deng, Koen Hindriks, Junxiao Wang*

    EMNLP Findings, 2025. [`conference`](https://arxiv.org/pdf/2507.05528)

11. :sparkles: **How well do Large Language Models Recognize Instructional Moves? Establishing Baselines for Foundation Models in Educational Discourse**

    *Kirk Vanacore, Rene F. Kizilcec*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.19903)

12. :sparkles: **Large Language Models Approach Expert Pedagogical Quality in Math Tutoring but Differ in Instructional and Linguistic Profiles**

    *Ramatu Oiza Abdulsalam, Segun Aroyehun*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.20780)

13. :sparkles: **Toward Trustworthy Difficulty Assessments: Large Language Models as Judges in Programming and Synthetic Tasks**

    *H. M. Shadman Tabib, Jaber Ahmed Deedar*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.18597)

14. :sparkles: **From Automation to Augmentation: Large Language Models Elevating Essay Scoring Landscape**

    *Changrong Xiao, Wenxing Ma, Sean Xin Xu, Kunpeng Zhang, Yufang Wang, Qi Fu*

    arXiv, 2024. [`preprint`](https://arxiv.org/pdf/2401.06431)

15. :sparkles: **Large Language Models As MOOCs Graders**

    *Shahriar Golchin, Nikhil Garuda, Christopher Impey, Matthew Wenger*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2402.03776)

16. :sparkles: **Large Language Models as Partners in Student Essay Evaluation**

    *Toru Ishida, Tongxi Liu, Hailong Wang, William K. Cheung*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2405.18632)


## [Application Domains](#content)

### [Computer Science](#content)

1. :sparkles: **ALGOGEN: Tool-Generated Verifiable Traces for Reliable Algorithm Visualization**

    *Liaokunpeng, Yuexiao Ma, Yisheng Lin, Hualin Zeng, Xiawu Zheng, Rongrong Ji*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.156/)

2. :sparkles: **Relying on LLMs: Student Practices and Instructor Norms are Changing in Computer Science Education**

    *Xinrui Lin, Heyan Huang, Shumin Shi, John Vines*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.05506)

3. :sparkles: **Learning by Teaching: Engaging Students as Instructors of Large Language Models in Computer Science Education**

    *Xinming Yang, Haasil Pujara, Jun Li*

    COLM, 2025. [`conference`](https://arxiv.org/abs/2508.05979)

4. :sparkles: **Partnering with AI: A Pedagogical Feedback System for LLM Integration into Programming Education**

    *Niklas Scholz, Manh Hung Nguyen, Adish Singla, Tomohiro Nagashima*

    ECTEL, 2025. [`conference`](https://arxiv.org/pdf/2507.00406)

5. :sparkles: **When Scaffolding Breaks: Investigating Student Interaction with LLM-Based Writing Support in Real-Time K-12 EFL Classrooms**

    *Junho Myung, Hyunseung Lim, Hana Oh, Hyoungwook Jin, Nayeon Kang, So-Yeon Ahn, Hwajung Hong, Alice Oh, Juho Kim*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2512.05506)

6. :sparkles: **ChatScratch: An AI-Augmented System Toward Autonomous Visual Programming Learning for Children Aged 6-12**

    *Liuqing Chen, Shuhong Xiao, Yunnong Chen, Ruoyu Wu, Yaxuan Song, Lingyun Sun*

    CHI, 2024. [`conference`](https://arxiv.org/abs/2402.04975)

7. :sparkles: **CodeAid: Evaluating a Classroom Deployment of an LLM-based Programming Assistant that Balances Student and Educator Needs**

    *Majeed Kazemitabaar, Runlong Ye, Xiaoning Wang, Austin Z. Henley, Paul Denny, Michelle Craig, Tovi Grossman*

    CHI, 2024. [`conference`](https://arxiv.org/abs/2401.11314)

8. :sparkles: **Exploring How Multiple Levels of GPT-Generated Programming Hints Support or Disappoint Novices**

    *Ruiwei Xiao, Xinying Hou, John Stamper*

    CHI, 2024. [`conference`](https://arxiv.org/abs/2404.02213)

9. :sparkles: **Interactions with Prompt Problems: A New Way to Teach Programming with Large Language Models**

    *James Prather, Paul Denny, Juho Leinonen, David H. Smith IV, Brent N. Reeves, Stephen MacNeil, Brett A. Becker, Andrew Luxton-Reilly, Thezyrie Amarouche, Bailey Kimmel*

    CHI, 2024. [`conference`](https://arxiv.org/abs/2401.10759)

10. :sparkles: **AI-Tutoring in Software Engineering Education**

    *Eduard Frankford, Clemens Sauerwein, Patrick Bassner, Stephan Krusche, Ruth Breu*

    ICSE, 2024. [`conference`](https://arxiv.org/abs/2404.02548)

11. :sparkles: **How Far Are We? The Triumphs and Trials of Generative AI in Learning Software Engineering**

    *Rudrajit Choudhuri, Dylan Liu, Igor Steinmacher, Marco Gerosa, Anita Sarma*

    ICSE, 2024. [`conference`](https://arxiv.org/abs/2312.11719)

12. :sparkles: **Evaluating the Effectiveness of LLMs in Introductory Computer Science Education: A Semester-Long Field Study**

    *Wenhan Lyu, Yimeng Wang, Tingting (Rachel)Chung, Yifan Sun, Yixuan Zhang*

    Learning@Scale, 2024. [`conference`](https://arxiv.org/abs/2404.13414)

13. :sparkles: **Accelerating Scientific Discovery with Generative Knowledge Extraction, Graph-Based Representation, and Multimodal Intelligent Graph Reasoning**

    *Markus J. Buehler*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2403.11996)

14. :sparkles: **Studying the effect of AI Code Generators on Supporting Novice Learners in Introductory Programming**

    *Majeed Kazemitabaar, Justin Chow, Carl Ka To Ma, Barbara J. Ericson, David Weintrop, Tovi Grossman*

    CHI, 2023. [`conference`](https://arxiv.org/abs/2302.07427)

### [Mathematics](#content)

1. :sparkles: **MathFlow: Enhancing the Perceptual Flow of MLLMs for Visual Mathematical Problems**

    *Shuhang Chen, Hangjie Yuan, Yunqiu Xu, Pengwei Liu, Tao Feng, Jun Cen, Zeying Huang, Yi Yang*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.43/)

2. :sparkles: **Bridging the Culture Gap: A Framework for LLM-Driven Socio-Cultural Localization of Math Word Problems in Low-Resource Languages**

    *Israel Abebe Azime, Tadesse Destaw Belay, Dietrich Klakow, Philipp Slusallek, Anshuman Chhabra*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.42/)

3. :sparkles: **EDU-CIRCUIT-HW: Evaluating Multimodal Large Language Models on Real-World University-Level STEM Student Handwritten Solutions**

    *Weiyu Sun, Liangliang Chen, Yongnuo Cai, Huiru Xie, Yi Zeng, Ying Zhang*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.751/)

4. :sparkles: **MathMixup: Boosting LLM Mathematical Reasoning with Difficulty-Controllable Data Synthesis and Curriculum Learning**

    *Xuchen Li, Jing Chen, Xuzhao Li, Hao Liang, Xiaohuan Zhou, Taifeng Wang, Wentao Zhang*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.118/)

5. :sparkles: **TabularMath: Understanding Math Reasoning over Tables with Large Language Models**

    *Shi-Yu Tian, Zhi Zhou, Wei Dong, Kun-Yang Yu, Ming Yang, Zi-Jian Cheng, Lan-Zhe Guo, Yu-Feng Li*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.759/)

6. :sparkles: **HiPhO: How Far Are (M)LLMs from Humans in the Latest High School Physics Olympiad Benchmark?**

    *Fangchen Yu, Haiyuan Wan, Qianjia Cheng, Yuchen Zhang, Jiacheng Chen, Fujun Han, Yulun Wu, Junchi Yao, Ruilizhen Hu, Ning Ding, Yu Cheng, Tao Chen, LEI BAI, Dongzhan Zhou, Yun Luo, Ganqu Cui, Peng Ye*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=w6DqR74BTt)

7. :sparkles: **MathEDU: Towards Adaptive Feedback for Student Mathematical Problem-Solving**

    *Wei-Ling Hsu, Yu-Chien Tang, An-Zi Yen*

    arXiv, 2025. [`conference`](https://arxiv.org/pdf/2505.18056)

8. :sparkles: **One Size doesn’t Fit All: A Personalized Conversational Tutoring Agent for Mathematics Instruction**

    *Ben Liu, Jihan Zhang, Fangquan Lin, Xu Jia, Min Peng*

    arXiv, 2025. [`preprint`](https://arxiv.org/pdf/2502.12633)

9. :sparkles: **Mathemyths: Leveraging Large Language Models to Teach Mathematical Language through Child-AI Co-Creative Storytelling**

    *Chao Zhang, Xuechen Liu, Katherine Ziska, Soobin Jeon, Chi-Lin Yu, Ying Xu*

    CHI, 2024. [`conference`](https://arxiv.org/abs/2402.01927)

10. :sparkles: **Stepwise Verification and Remediation of Student Reasoning Errors with Large Language Model Tutors**

    *Nico Daheim, Jakub Macina, Manu Kapur, Iryna Gurevych, Mrinmaya Sachan*

    EMNLP, 2024. [`conference`](https://aclanthology.org/2024.emnlp-main.478/)

11. :sparkles: **Automatic Generation of Socratic Subquestions for Teaching Math Word Problems**

    *Kumar Shridhar, Jakub Macina, Mennatallah El-Assady, Tanmay Sinha, Manu Kapur, Mrinmaya Sachan*

    EMNLP, 2022. [`conference`](https://aclanthology.org/2022.emnlp-main.277/)

### [Language Learning](#content)

1. :sparkles: **GPT-4 as a Homework Tutor Can Improve Student Engagement and Learning Outcomes**

    *Alessandro Vanzo, Sankalan Pal Chowdhury, Mrinmaya Sachan*

    ACL, 2025. [`conference`](https://aclanthology.org/2025.acl-long.1502/)

2. :sparkles: **Position: LLMs Can be Good Tutors in Foreign Language Education**

    *Jingheng Ye, Shen Wang, Deqing Zou, Yibo Yan, Kun Wang, Hai-Tao Zheng, Zenglin Xu, Irwin King, Philip S. Yu, Qingsong Wen*

    EMNLP, 2025. [`conference`](https://arxiv.org/abs/2502.05467)

3. :sparkles: **BIPED: Pedagogically Informed Tutoring System for ESL Education**

    *Soonwoo Kwon, Sojung Kim, Minju Park, Seunghyun Lee, Kyuseok Kim*

    ACL, 2024. [`conference`](https://aclanthology.org/2024.acl-long.186/)

4. :sparkles: **WordPlay: An Agent Framework for Language Learning Games**

    *Ariel Blobstein, Daniel Izmaylov, Tal Yifat, Michal Levy, Avi Segal, Avi Segal*

    NeurIPS - Workshop on Generative AI for Education (GAIED), 2024. [`workshop`](https://gaied.org/neurips2023/files/9/9_paper.pdf)

### [Medical Education](#content)

1. :sparkles: **PUPPET: Neural-Symbolic Standardized Patients for Mental Health**

    *Chen Xu, Yu ji, Zhenyu Lv, Yang Yi, Yizhe Yang, Luyao Ji, Chaoyi Chen, Xianyang Wang, Tian Lan, Zhihua Wang, Juan Wang, Xunde Dong, Fuze Tian, Qunxi Dong, Bin Hu*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.121/)

2. :sparkles: **DentalGPT: Incentivizing Multimodal Reasoning in Dentistry**

    *Zhenyang Cai, Jiaming Zhang, Junjie Zhao, Ziyi Zeng, Yanchao Li, Liang Jingyi, Junying Chen, Yunjin Yang, Jiajun You, Shuzhi Deng, Xieruiqiii, Yuanting Chen, Xiangyi Feng, Jianquan Li, Liangyi Chen, Junwen Wang, Shan Jiang, Benyou Wang*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.135/)

3. :sparkles: **ClinTutor-R1: Advancing Scalable and Robust One-to-Many Alignment in Clinical Socratic Education**

    *Zhitao He, Haolin Yang, Zeyu Qin, Yi Fung*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=15Gs65kvHS)

4. :sparkles: **CaseMaster: Designing and Evaluating a Probe for Oral Case Presentation Training with LLM Assistance**

    *Yang Ouyang, Yuansong Xu, Chang Jiang, Yifan Jin, Haoran Jiang, Quan Li*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2601.19332)

5. :sparkles: **DischargeSim: A Simulation Benchmark for Educational Doctor–Patient Communication at Discharge**

    *Zonghai Yao, Michael Sun, Won Seok Jang, SUNJAE KWON, Soie Kwon, Hong Yu*

    EMNLP, 2025. [`conference`](https://arxiv.org/abs/2509.07188)

6. :sparkles: **Leveraging Large Language Model as Simulated Patients for Clinical Education**

    *Yanzeng Li, Cheng Zeng, Jialun Zhong, Ruoyu Zhang, Minhao Zhang, Lei Zou*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2404.13066)

### [Humanities](#content)

1. :sparkles: **Exploring LLM-Powered Role and Action-Switching Pedagogical Agents for History Education in Virtual Reality**

    *Zihao Zhu, Ao Yu, Xin Tong, Pan Hui*

    CHI, 2025. [`conference`](https://arxiv.org/pdf/2505.02699)

### [Social Good](#content)

1. :sparkles: **GuideDog: A Real-World Egocentric Multimodal Dataset for Blind and Low-Vision Accessibility-Aware Guidance**

    *Junhyeok Kim, Jaewoo Park, Junhee Park, Sangeyl Lee, Jiwan Chung, Jisung Kim, Ji Hoon Joung, Youngjae Yu*

    ACL, 2026. [`conference`](https://aclanthology.org/2026.acl-long.251/)

2. :sparkles: **PatientSim: A Persona-Driven Simulator for Realistic Doctor-Patient Interactions**

    *Daeun Kyung, Hyunseung Chung, Seongsu Bae, Jiho Kim, Jae Ho Sohn, Taerim Kim, Soo Kyung Kim, Edward Choi*

    arXiv, 2025. [`preprint`](https://arxiv.org/pdf/2505.17818)

3. :sparkles: **LLM-Powered AI Tutors with Personas for d/Deaf and Hard-of-Hearing Online Learners**

    *Haocong Cheng, Si Chen, Christopher Perdriau, Yun Huang*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2411.09873)

### [Social Skills](#content)

1. :sparkles: **SocialCoach: Personalized Social Skill Learning with RL-based Agentic Tutoring and Practice**

    *Tianfu Wang, Max Xiong, Jianxun Lian, Hongyuan Zhu, Zhengyu Hu, Yuxuan Lei, Linxiao Gong, Xiaofang Li, Peiting Tsai, Nicholas Jing Yuan, Qi Zhang*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2606.04155)

2. :sparkles: **ACE: A LLM-based Negotiation Coaching System**

    *Ryan Shea, Aymen Kallala, Xin Lucy Liu, Michael W. Morris, Zhou Yu*

    EMNLP, 2024. [`conference`](https://aclanthology.org/2024.emnlp-main.709/)


## [Datasets, Benchmarks & Toolkits](#content)

### [Datasets](#content)

1. :sparkles: **EduEVAL-DB: A Role-Based Dataset for Pedagogical Risk Evaluation in Educational Explanations**

    *Javier Irigoyen, Roberto Daza, Aythami Morales, Julian Fierrez, Francisco Jurado, Alvaro Ortigosa, Ruben Tolosana*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.15531)

2. :sparkles: **FoundationalASSIST: An Educational Dataset for Foundational Knowledge Tracing and Pedagogical Grounding of LLMs**

    *Eamon Worden, Cristina Heffernan, Neil Heffernan, Shashank Sonkar*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.00070)

3. :sparkles: **IntrEx: A Dataset for Modeling Engagement in Educational Conversations**

    *Xingwei Tan, Mahathi Parvatham, Chiara Gambi, Gabriele Pergola*

    EMNLP Findings, 2025. [`conference`](https://arxiv.org/abs/2509.06652)

4. :sparkles: **QACP: An Annotated Question Answering Dataset for Assisting Chinese Python Programming Learners**

    *Rui Xiao, Lu Han, Xiaoying Zhou, Jiong Wang, Na Zong, Pengyu Zhang*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2402.07913)

### [Benchmarks](#content)

1. :sparkles: **AMO-Bench: Large Language Models Still Struggle in High School Math Competitions**

    *Junlin Liu, Shengnan An, Shuang Zhou, Dan Ma, Yehao Lin, Xinxuan Lv, Xuanlin Wang, Xiaoyu Li, Ziwen Wang, Xuezhi Cao, Xunliang Cai*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.101/)

2. :sparkles: **DataSciBench: An LLM Agent Benchmark for Data Science**

    *Dan Zhang, Sining Zhoubian, Min Cai, Fengzu Li, Lekang Yang, Wei Wang, Tianjiao Dong, Ziniu Hu, Jie Tang, Yisong Yue*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.181/)

3. :sparkles: **PedagogyBench: A Cognitive-Driven Benchmark for Multimodal Instructional Video Understanding**

    *Xiaokang Jin, Jia Zhu, Jingjiang Liu, Yabing Shi, Jueqi Guan, Hao Chen, Pasquale De Meo*

    ACL Findings, 2026. [`conference`](https://aclanthology.org/2026.findings-acl.614/)

4. :sparkles: **Position: Sycophancy is an Educational Safety Risk: Why LLM Tutors Need Sycophancy Benchmarks**

    *Enkelejda Kasneci, Gjergji Kasneci*

    ICML, 2026. [`conference`](https://openreview.net/forum?id=Oxp2oWV0H3)

5. :sparkles: **CASTLE: A Comprehensive Benchmark for Evaluating Student-Tailored Personalized Safety in Large Language Models**

    *Rui Jia, Ruiyi Lan, Fengrui Liu, Zhongxiang Dai, Bo Jiang, Jing Shao, Jingyuan Chen, Guandong Xu, Fei Wu, Min Zhang*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.05633)

6. :sparkles: **ISD-Agent-Bench: A Comprehensive Benchmark for Evaluating LLM-based Instructional Design Agents**

    *YoungHoon Jeon, Suwan Kim, Haein Son, Sookbun Lee, Yeil Jeong, Unggi Lee*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.10620)

7. :sparkles: **Visual Reasoning Benchmark: Evaluating Multimodal LLMs on Classroom-Authentic Visual Problems from Primary Education**

    *Mohamed Huti, Alasdair Mackintosh, Amy Waldock, Dominic Andrews, Maxime Lelievre, Moritz Boos, Tobias Murray, Paul Atherton, Robin A. A. Ince, Oliver G. B. Garrod*

    arXiv, 2026. [`preprint`](https://arxiv.org/abs/2602.12196)

8. :sparkles: **MathTutorBench: A Benchmark for Measuring Open-ended Pedagogical Capabilities of LLM Tutors**

    *Jakub Macina, Nico Daheim, Ido Hakimi, Manu Kapur, Iryna Gurevych, Mrinmaya Sachan*

    EMNLP, 2025. [`conference`](https://arxiv.org/abs/2502.18940)

9. :sparkles: **VisualEDU: A Benchmark for Assessing Coding and Visual Comprehension through Educational Problem-Solving Video Generation**

    *Hao Chen, TIANYU SHI, Pengran huang, Zeyuan Li, Jiahui Pan, Qianglong Chen, Lewei He*

    EMNLP Findings, 2025. [`conference`](https://aclanthology.org/2025.findings-emnlp.889/)

10. :sparkles: **Benchmarking the Pedagogical Knowledge of Large Language Models**

    *Maxime Lelièvre, Amy Waldock, Meng Liu, Natalia Valdés Aspillaga, Alasdair Mackintosh, María José Ogando Portela, Jared Lee, Paul Atherton, Robin A. A. Ince, Oliver G. B. Garrod*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2506.18710)

11. :sparkles: **From Answers to Questions: EQGBench for Evaluating LLMs' Educational Question Generation**

    *Chengliang Zhou, Mei Wang, Ting Zhang, Qiannan Zhu, Jian Li, Hua Huang*

    arXiv, 2025. [`preprint`](https://arxiv.org/abs/2508.10005)

12. :sparkles: **Towards Robust Evaluation of STEM Education: Leveraging MLLMs in Project-Based Learning**

    *Yanhao Jia, Xinyi Wu, Qinglin Zhang, Yiran Qin, Luwei Xiao, Shuai Zhao*

    arXiv, 2025. [`preprint`](https://arxiv.org/pdf/2505.17050)

13. :sparkles: **Dr.Academy: A Benchmark for Evaluating Questioning Capability in Education for Large Language Models**

    *Yuyan Chen, Chenwei Wu, Songzhou Yan, Panjun Liu, Yanghua Xiao*

    ACL, 2024. [`conference`](https://aclanthology.org/2024.acl-long.173/)

14. :sparkles: **Language Models as Science Tutors**

    *Alexis Chevalier, Jiayi Geng, Alexander Wettig, Howard Chen, Sebastian Mizera, Toni Annala, Max Aragon, Arturo Rodriguez Fanlo, Simon Frieder, Simon Machado, Akshara Prabhakar, Ellie Thieu, Jiachen T. Wang, Zirui Wang, Xindi Wu, Mengzhou Xia, Wenhan Xia, Jiatong Yu, Junjie Zhu, Zhiyong Ren, Sanjeev Arora, Danqi Chen*

    ICML, 2024. [`conference`](https://proceedings.mlr.press/v235/chevalier24a.html)

15. :sparkles: **E-EVAL: A Comprehensive Chinese K-12 Education Evaluation Benchmark for Large Language Models**

    *Jinchang Hou, Chang Ao, Haihong Wu, Xiangtao Kong, Zhigang Zheng, Daijia Tang, Chengming Li, Xiping Hu, Ruifeng Xu, Shiwen Ni, Min Yang*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2401.15927)

### [Toolkits](#content)

1. :sparkles: **Experimental Interface for Multimodal and Large Language Model Based Explanations of Educational Recommender Systems**

    *Hasan Abu-Rasheed, Christian Weber, Madjid Fathi*

    arXiv, 2024. [`preprint`](https://arxiv.org/abs/2402.07910)


