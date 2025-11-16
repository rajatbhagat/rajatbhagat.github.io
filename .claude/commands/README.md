# Portfolio Website Commands

This directory contains custom Claude Code slash commands for managing your portfolio website.

## Available Commands

### `/update-portfolio`

A specialized agent for updating your portfolio website with new content.

**Usage:**
```
/update-portfolio
```

Then tell the agent what you want to update. Examples:

**Add New Job:**
```
/update-portfolio
I got a new job at Amazon as a Principal Engineer starting January 2025
```

**Add New Project:**
```
/update-portfolio
Add a new project: Built a ML-powered recommendation engine using Python and TensorFlow that improved user engagement by 35%
```

**Add Images:**
```
/update-portfolio
I have screenshots of my new project in /path/to/images. Add them to the projects page.
```

**Update Skills:**
```
/update-portfolio
Add Rust, Go, and GraphQL to my skills section
```

**Add Certification:**
```
/update-portfolio
I just got AWS Certified Solutions Architect Professional certification in January 2025
```

**Update Contact Info:**
```
/update-portfolio
Update my email to newemail@example.com and add my Twitter handle @rajatbhagat
```

**Add Blog Post or Article:**
```
/update-portfolio
I wrote an article on Medium about microservices. Add it to my portfolio with the link.
```

## How It Works

The agent will:
1. Ask clarifying questions about your update
2. Read the relevant files in your portfolio
3. Make the appropriate changes while maintaining style and formatting
4. Commit the changes with a descriptive message
5. Push to GitHub automatically
6. Confirm the update was successful

Your website at https://rajatbhagat.github.io will automatically update within 2-3 minutes.

## Portfolio Structure

- `index.md` - Home page
- `about.md` - Work experience, education, skills
- `projects.md` - Project showcase
- `contact.md` - Contact information
- `assets/images/` - All images and media
- `assets/css/style.scss` - Custom styling
- `_config.yml` - Site configuration

## Tips

- Be specific about what you want to update
- Provide dates, metrics, and details for better content
- If adding images, mention where they're located on your computer
- The agent maintains your existing style and formatting automatically

## Need Help?

Just invoke `/update-portfolio` and the agent will guide you through the process!
