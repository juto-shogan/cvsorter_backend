const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

// Keywords for different professions, converted from your Python dictionary
const professionKeywords = {
    'software_dev_Keywords': {
        'keywords': ['python', 'java', 'c++', 'javascript', 'html', 'css', 'sql', 'ruby', 'php', 'agile', 'scrum', 'restful APIs', 'microservices', 'devops', 'git', 'docker', 'kubernetes'],
        'experience_levels': ['entry-level (0-2 years)', 'junior (2-4 years)', 'mid-level (4-7 years)', 'senior (7+ years)', 'lead (10+ years)'],
        'related_roles': ['Software Engineer', 'Web Developer', 'Backend Developer', 'Frontend Developer', 'Full-Stack Developer', 'Mobile Developer', 'Application Developer'],
        'potential_needs': ['Bachelor\'s degree in Computer Science or related field', 'Strong problem-solving skills', 'Experience with specific frameworks (e.g., React, Angular, Spring, Django)', 'Understanding of software development lifecycle']
    },
    'data_science_keywords': {
        'keywords': ['python', 'r', 'sql', 'machine learning', 'statistics', 'data analysis', 'data visualization', 'big data', 'deep learning', 'natural language processing (NLP)', 'time series analysis', 'statistical modeling', 'etl'],
        'experience_levels': ['entry-level (0-2 years)', 'junior (2-4 years)', 'mid-level (4-7 years)', 'senior (7+ years)', 'lead (10+ years)'],
        'related_roles': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Analyst', 'Data Engineer', 'Research Scientist'],
        'potential_needs': ['Bachelor\'s or Master\'s degree in a quantitative field (e.g., Statistics, Mathematics, Computer Science)', 'Experience with data manipulation libraries (e.g., pandas, numpy)', 'Experience with visualization tools (e.g., matplotlib, seaborn, Tableau)', 'Strong analytical and problem-solving skills']
    },
    'customer_service_keywords': {
        'keywords': ['customer service', 'communication', 'problem solving', 'teamwork', 'adaptability', 'active listening', 'empathy', 'conflict resolution', 'phone etiquette', 'email communication', 'crm', 'customer satisfaction'],
        'experience_levels': ['entry-level (0-2 years)', 'associate (1-3 years)', 'specialist (3-5 years)', 'senior (5+ years)', 'manager (7+ years)'],
        'related_roles': ['Customer Service Representative', 'Customer Support Specialist', 'Account Manager', 'Client Relations Manager', 'Help Desk Agent'],
        'potential_needs': ['High school diploma or equivalent', 'Excellent verbal and written communication skills', 'Ability to remain calm under pressure', 'Strong interpersonal skills']
    },
    'cyber_security_keywords': {
        'keywords': ['network security', 'firewall', 'encryption', 'penetration testing', 'incident response', 'linux', 'information security', 'vulnerability assessment', 'security analysis', 'ids/ips', 'siem', 'risk management', 'compliance'],
        'experience_levels': ['entry-level (0-2 years)', 'junior (2-4 years)', 'security analyst (3-6 years)', 'security engineer (5-8 years)', 'security architect (7+ years)', 'security manager (10+ years)'],
        'related_roles': ['Cybersecurity Analyst', 'Security Engineer', 'Security Consultant', 'Information Security Analyst', 'Penetration Tester', 'Security Architect', 'Security Manager'],
        'potential_needs': ['Bachelor\'s degree in Computer Science, Cybersecurity, or related field', 'Relevant certifications (e.g., CompTIA Security+, CISSP, CEH)', 'Understanding of security principles and best practices', 'Experience with security tools and technologies']
    },
    'standard_keywords': {
        'keywords': ['communication', 'teamwork', 'problem solving', 'adaptability', 'leadership', 'time management', 'critical thinking', 'creativity', 'attention to detail', 'interpersonal skills', 'organization', 'initiative', 'professionalism', 'collaboration'],
        'experience_levels': ['applicable across all experience levels'],
        'related_roles': ['relevant to virtually all roles'],
        'potential_needs': ['demonstrated ability in relevant situations']
    }
};

class CVAnalyzer {

    // Extract text from different file types using your provided logic
    async extractText(filePath, mimeType) {
        try {
            switch (mimeType) {
                case 'application/pdf':
                    const pdfBuffer = await fs.readFile(filePath);
                    const pdfData = await pdfParse(pdfBuffer);
                    return pdfData.text.toLowerCase();

                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    const docxResult = await mammoth.extractRawText({ path: filePath });
                    return docxResult.value.toLowerCase();

                default:
                    throw new Error('Unsupported file type');
            }
        } catch (error) {
            throw new Error(`Text extraction failed: ${error.message}`);
        }
    }

    // Main analysis function that combines both sets of logic
    async analyzeCV(text, fileName) {
        try {
            // --- Your original main.py logic (now correctly integrated) ---
            const cvChecker = (content, keywords) => {
                const matchedKeywords = [];
                for (const keyword of keywords) {
                    if (content.includes(keyword.toLowerCase())) {
                        matchedKeywords.push(keyword);
                    }
                }
                return matchedKeywords;
            };

            const determineRole = (content) => {
                let maxMatches = 0;
                let bestRole = null;
                let bestRoleDetails = null;

                for (const role in professionKeywords) {
                    const details = professionKeywords[role];
                    const matchedKeywords = cvChecker(content, details.keywords);
                    const count = matchedKeywords.length;

                    if (count > maxMatches) {
                        maxMatches = count;
                        bestRole = role;
                        bestRoleDetails = details;
                    }
                }
                return { bestRole, roleDetails: bestRoleDetails, score: maxMatches };
            };
            
            const grader = (count, roleDetails) => {
                if (!roleDetails || !roleDetails.keywords) return 'Failed';
                const numberOfKeywords = roleDetails.keywords.length;
                if (numberOfKeywords === 0) {
                    return 'Under consideration';
                }
                if (count >= numberOfKeywords / 2) {
                    if (count === numberOfKeywords) {
                        return 'Passed';
                    } else {
                        return 'Under consideration';
                    }
                } else {
                    return 'Failed';
                }
            };

            const { bestRole, roleDetails, score } = determineRole(text);
            const matchedKeywords = cvChecker(text, roleDetails ? roleDetails.keywords : []);
            const grade = grader(score, roleDetails);

            // --- Your new extraction logic (now correctly integrated) ---
            const candidateName = this.extractName(text);
            const position = this.extractPosition(text);
            const experience = this.extractExperience(text);
            const skills = this.extractSkills(text);
            const education = this.extractEducation(text);
            const location = this.extractLocation(text);
            const email = this.extractEmail(text);
            const phone = this.extractPhone(text);
            
            // Return all the data your controller is expecting
            return {
                fileName: fileName,
                extracted_text: text,
                best_role: bestRole, // From main.py logic
                score: score, // From main.py logic
                grade: grade, // From main.py logic
                matched_keywords: matchedKeywords, // From main.py logic
                
                // Fields from your new extraction logic
                candidateName,
                position,
                experience,
                skills,
                education,
                location,
                email,
                phone
            };

        } catch (error) {
            throw new Error(`CV analysis failed: ${error.message}`);
        }
    }

    // All of your new extraction methods from your previous code block
    extractName(text) {
        const namePatterns = [
            /Name[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
            /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
        ];
        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match) return match[1].trim();
        }
        return 'Unknown Candidate';
    }

    extractEmail(text) {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const match = text.match(emailRegex);
        return match ? match[0] : '';
    }

    extractPhone(text) {
        const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        const match = text.match(phoneRegex);
        return match ? match[0] : '';
    }

    extractLocation(text) {
        const locationPatterns = [
            /Location[:\s]+([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*)/i,
            /Address[:\s]+([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*)/i,
        ];
        for (const pattern of locationPatterns) {
            const match = text.match(pattern);
            if (match) return match[1].trim();
        }
        return 'Not specified';
    }

    extractPosition(text) {
        const positionKeywords = [
            'Software Engineer', 'Developer', 'Data Scientist', 'Product Manager',
            'Designer', 'Analyst', 'Consultant', 'Manager', 'Director'
        ];
        for (const keyword of positionKeywords) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                return keyword;
            }
        }
        return 'General Position';
    }

    extractExperience(text) {
        const expPatterns = [
            /(\d+)[\+\-\s]*years?\s*(of\s*)?experience/i,
            /experience[:\s]+(\d+)[\+\-\s]*years?/i,
            /(\d+)[\+\-\s]*years?\s*in/i
        ];
        for (const pattern of expPatterns) {
            const match = text.match(pattern);
            if (match) return parseInt(match[1]);
        }
        return 0;
    }

    extractSkills(text) {
        const skillsKeywords = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
            'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git',
            'Machine Learning', 'Data Analysis', 'Project Management', 'Agile'
        ];
        const foundSkills = [];
        const textLower = text.toLowerCase();
        for (const skill of skillsKeywords) {
            if (textLower.includes(skill.toLowerCase())) {
                foundSkills.push(skill);
            }
        }
        return foundSkills;
    }

    extractEducation(text) {
        const educationLevels = ['PhD', 'Master', 'Bachelor', 'Associate', 'Diploma'];
        for (const level of educationLevels) {
            if (text.toLowerCase().includes(level.toLowerCase())) {
                return level;
            }
        }
        return 'Not specified';
    }
}

module.exports = new CVAnalyzer();