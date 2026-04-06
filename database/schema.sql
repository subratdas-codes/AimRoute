-- AimRoute — MySQL 8 schema
-- Run: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS aimroute CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aimroute;

-- ─────────────────────────────────────────────────────────────────────────────
-- Users
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    full_name        VARCHAR(120)    NOT NULL,
    email            VARCHAR(255)    NOT NULL,
    hashed_password  VARCHAR(255)    NOT NULL,
    is_active        TINYINT(1)      NOT NULL DEFAULT 1,
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_profiles (
    id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED  NOT NULL,
    bio         TEXT,
    skills      TEXT,
    interests   TEXT,
    education   VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uq_profiles_user (user_id),
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────────────────
-- Career Domains
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS career_domains (
    id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name        VARCHAR(120)  NOT NULL,
    description TEXT,
    icon        VARCHAR(50),
    PRIMARY KEY (id),
    UNIQUE KEY uq_domains_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────────────────
-- Assessment Questions
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessment_questions (
    id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    question_text TEXT          NOT NULL,
    category      VARCHAR(80)   NOT NULL,
    `order`       INT           NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────────────────
-- User Assessments
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_assessments (
    id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id      INT UNSIGNED  NOT NULL,
    completed_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_assessments_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessment_answers (
    id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    assessment_id  INT UNSIGNED  NOT NULL,
    question_id    INT UNSIGNED  NOT NULL,
    answer_value   TINYINT       NOT NULL COMMENT '1–5 Likert scale',
    PRIMARY KEY (id),
    CONSTRAINT fk_answers_assessment FOREIGN KEY (assessment_id)
        REFERENCES user_assessments (id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question   FOREIGN KEY (question_id)
        REFERENCES assessment_questions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────────────────
-- Career Matches
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS career_matches (
    id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    assessment_id    INT UNSIGNED  NOT NULL,
    career_domain_id INT UNSIGNED  NOT NULL,
    score            INT           NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_matches_assessment FOREIGN KEY (assessment_id)
        REFERENCES user_assessments (id) ON DELETE CASCADE,
    CONSTRAINT fk_matches_domain     FOREIGN KEY (career_domain_id)
        REFERENCES career_domains (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed Data — Career Domains
-- ─────────────────────────────────────────────────────────────────────────────

INSERT IGNORE INTO career_domains (name, description, icon) VALUES
('Software Engineering',  'Design, build, and maintain software systems',             '💻'),
('Data Science',          'Analyse data to extract insights and build models',        '📊'),
('UX / Product Design',   'Create intuitive and accessible user experiences',         '🎨'),
('Cybersecurity',         'Protect systems and networks from digital attacks',        '🔒'),
('Cloud & DevOps',        'Build and operate scalable cloud infrastructure',          '☁️'),
('Business Analysis',     'Bridge business needs and technology solutions',           '📋'),
('Digital Marketing',     'Plan and execute data-driven marketing campaigns',         '📣'),
('Project Management',    'Lead cross-functional teams to deliver projects on time',  '🗂️');

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed Data — Assessment Questions (3 per domain)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT IGNORE INTO assessment_questions (question_text, category, `order`) VALUES
-- Software Engineering
('I enjoy writing code and solving algorithmic problems.',            'Software Engineering', 1),
('I like designing system architectures and APIs.',                  'Software Engineering', 2),
('I find debugging complex issues satisfying.',                      'Software Engineering', 3),
-- Data Science
('I enjoy working with large datasets and finding patterns.',        'Data Science', 4),
('I am comfortable with statistics and probability.',                'Data Science', 5),
('I like building predictive models and visualisations.',            'Data Science', 6),
-- UX / Product Design
('I love sketching interfaces and prototyping ideas.',               'UX / Product Design', 7),
('User empathy and usability testing excite me.',                    'UX / Product Design', 8),
('I pay close attention to visual detail and aesthetics.',           'UX / Product Design', 9),
-- Cybersecurity
('I am curious about how systems can be exploited and protected.',   'Cybersecurity', 10),
('I enjoy learning about encryption and network security.',          'Cybersecurity', 11),
('I like thinking like an attacker to improve defences.',            'Cybersecurity', 12),
-- Cloud & DevOps
('I enjoy automating repetitive infrastructure tasks.',              'Cloud & DevOps', 13),
('I like working with containers, CI/CD pipelines, and monitors.',   'Cloud & DevOps', 14),
('Reliability engineering and scaling systems interests me.',        'Cloud & DevOps', 15),
-- Business Analysis
('I like gathering requirements from stakeholders.',                 'Business Analysis', 16),
('Translating business problems into technical solutions appeals.',  'Business Analysis', 17),
('I enjoy creating process models and documentation.',               'Business Analysis', 18),
-- Digital Marketing
('I enjoy crafting compelling content for online audiences.',        'Digital Marketing', 19),
('Analysing campaign metrics and A/B testing interests me.',         'Digital Marketing', 20),
('SEO, SEM, and social media strategy excite me.',                   'Digital Marketing', 21),
-- Project Management
('I like planning tasks, timelines, and resource allocation.',       'Project Management', 22),
('Coordinating teams and managing risks is something I do well.',    'Project Management', 23),
('I enjoy running retrospectives and continuous improvement.',       'Project Management', 24);
