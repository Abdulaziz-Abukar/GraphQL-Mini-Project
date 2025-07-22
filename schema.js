const Skill = require("./models/Skill");
const Module = require("./models/Module");

const typeDefs = `#graphql
    type Skill {
        id: ID!
        title: String!
        status: String
        modules: [Module]
    }

    type Module {
        id: ID!
        title: String!
        description: String
        skill: Skill
    }

    type Queries {
        getAllSkills(options: SkillQueryInput): [Skill]
        getSkill(id: ID!): Skill
        getModulesBySkill(skillId: ID!): [Module]
    }

    input SkillQueryInput {
        filter: SkillFilter
        sortBy: String
        sortOrder: Int
        page: Int
        limit: Int
    }

    input SkillFilter {
        title: String
        status: String
    }

    type Mutations {
        addSkill(input: SkillInput!): Skill
        updateSkill(id: ID!, fields: SkillInput!): Skill
        deleteSkill(id: ID!): Skill
        addModule(input: ModuleInput!): Module
    }

    input SkillInput {
        title: String!
        status: String
    }

    input ModuleInput {
        title: String!
        description: String
        skillId: ID!
    }
`;

const resolvers = {
  Query: {
    getAllSkills: async (_, { options }) => {
      try {
        const {
          filter = {},
          sortBy = "title",
          sortOrder = 1,
          page = 1,
          limit = 10,
        } = options;

        // build dynamic mongoDB query
        const query = {};

        if (filter.title) {
          query.title = { $regex: filter.title, $options: "i" }; // case-insenitive partial match
        }
        if (filter.status) {
          query.status = filter.status;
        }

        // Build sort object (e.g., 1 = ascending, -1 = descending)
        const sortObj = { [sortBy]: sortOrder };
        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Query the database
        const skills = await Skill.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit);

        return skills;
      } catch (err) {
        console.error(err);
        throw new Error("Error, could not fetch skills: ", err);
      }
    },
    getSkill: async (_, { id }) => {
      try {
        return await Skill.findById(id);
      } catch (err) {
        console.error(err);
        throw new Error("Error, could not find Skill: ", err);
      }
    },
    getModulesBySkill: async (_, { skillId }) => {
      try {
        return await Module.find({ skill: skillId });
      } catch (err) {
        console.error(err);
        throw new Error("Could not find modules: ", err);
      }
    },
  },
};
