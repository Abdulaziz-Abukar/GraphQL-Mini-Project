# Project: SkillForge Tracker Mini

You'll build a mini version of **SkillForge** that allows users to:

1. **Track skills** (title, status)
2. **Add Modules** to skills (title, description)
3. Query skills and their modules
4. Query modules and their skill
5. Support:  
   Filtering skills by status  
   Sorting skills by title or creation date  
   Paginating skill results

## Project Folder Structure

```bash
📁 graphql-mini-project
│
├── models/
│   ├── Skill.js
│   └── Module.js
│
├── index.js
├── schema.js (optional: split typeDefs/resolvers)
└── .env
```

## Checklist of Features to Build

1. Models

- `Skill`: title (String), status (String: "Planned", "In Progress", "Completed")
- `Module`: title, description, skill (ObjectId)

2. TypeDefs & Resolvers

- Queries:  
  `getAllSkills(filter, sort, page, limit)`  
  `getSkill(id)`  
  `getModulesBySkill(skillId)`

- Mutations  
  `addSkill(input)`  
  `updateSkill(id, fields)`  
  `deleteSkill(id)`  
  `addModule(input)`

- Relationships:  
  Skill -> modules  
  Module -> skill

3. Sample Operations (you'll write in GraphQL Playground):

- Add a skill + module
- Fetch a skill with modules
- Paginate sorted skills
- Filter by status

## Extra Credit

- Add `createdAt` to `Skill` model and sort by newest
- Add `updateSkillStatus(id, status)` as a custom mutation
- Add module count to `Skill` using `@computed`
