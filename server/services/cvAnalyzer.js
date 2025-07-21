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

    // Main analysis function using logic from your main.py file
    async analyzeCV(text, fileName) {
        try {
            // Your original cv_checker function from main.py
            const cvChecker = (content, keywords) => {
                const matchedKeywords = [];
                for (const keyword of keywords) {
                    if (content.includes(keyword.toLowerCase())) {
                        matchedKeywords.push(keyword);
                    }
                }
                return matchedKeywords;
            };

            // Your original determine_role function from main.py
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
            
            // Your original grader function from main.py
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

            // Determine the best role and get analysis details
            const { bestRole, roleDetails, score } = determineRole(text);
            const matchedKeywords = cvChecker(text, roleDetails ? roleDetails.keywords : []);
            const grade = grader(score, roleDetails);

            return {
                filename: fileName,
                extracted_text: text,
                best_role: bestRole,
                score: score,
                grade: grade,
                matched_keywords: matchedKeywords
            };

        } catch (error) {
            throw new Error(`CV analysis failed: ${error.message}`);
        }
    }
}

module.exports = new CVAnalyzer();