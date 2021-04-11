const {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} = require('nexus')
const { DateTimeResolver } = require('graphql-scalars')

const DateTime = asNexusMethod(DateTimeResolver, 'date')
// similar to get
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allProducts', {
      type: 'Product',
      resolve: (_parent, _args, context) => {
        return context.prisma.product.findMany()
      },
    })
    t.nonNull.list.nonNull.field('allCategories', {
      type: 'Category',
      resolve: (_parent, _args, context) => {
        return context.prisma.category.findMany()
      },
    })

    t.nullable.field('categoryById', {
      type: 'Category',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.category.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    // t.nonNull.list.nonNull.field('feed', {
    //   type: 'Post',
    //   args: {
    //     searchString: stringArg(),
    //     skip: intArg(),
    //     take: intArg(),
    //     orderBy: arg({
    //       type: 'PostOrderByUpdatedAtInput',
    //     }),
    //   },
    //   resolve: (_parent, args, context) => {
    //     const or = args.searchString
    //       ? {
    //         OR: [
    //           { title: { contains: args.searchString } },
    //           { content: { contains: args.searchString } },
    //         ],
    //       }
    //       : {}

    //     return context.prisma.post.findMany({
    //       where: {
    //         published: true,
    //         ...or,
    //       },
    //       take: args.take || undefined,
    //       skip: args.skip || undefined,
    //       orderBy: args.orderBy || undefined,
    //     })
    //   },
    // })

  //   t.list.field('draftsByUser', {
  //     type: 'Post',
  //     args: {
  //       userUniqueInput: nonNull(
  //         arg({
  //           type: 'UserUniqueInput',
  //         }),
  //       ),
  //     },
  //     resolve: (_parent, args, context) => {
  //       return context.prisma.user
  //         .findUnique({
  //           where: {
  //             id: args.userUniqueInput.id || undefined,
  //             email: args.userUniqueInput.email || undefined,
  //           },
  //         })
  //         .posts({
  //           where: {
  //             published: false,
  //           },
  //         })
  //     },
  //   })
  },
})
// similar to create, update, delete

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
  //   t.nonNull.field('signupUser', {
  //     type: 'User',
  //     args: {
  //       data: nonNull(
  //         arg({
  //           type: 'UserCreateInput',
  //         }),
  //       ),
  //     },
  //     resolve: (_, args, context) => {
  //       const postData = args.data.posts
  //         ? args.data.posts.map((post) => {
  //           return { title: post.title, content: post.content || undefined }
  //         })
  //         : []
  //       return context.prisma.user.create({
  //         data: {
  //           name: args.data.name,
  //           email: args.data.email,
  //           posts: {
  //             create: postData,
  //           },
  //         },
  //       })
  //     },
    // })

    t.field('createCategory', {
      type: 'Category',
      args: {
        data: nonNull(
          arg({
            type: 'CategoryCreateInput',
          }),
        ),
        productTitle: nonNull(stringArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.category.create({
          data: {
            description: args.data.description,
            content: args.data.content,
            product: {
              connect: { title: args.productTitle },
            },
          },
        })
      },
    })

    // t.field('togglePublishPost', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: async (_, args, context) => {
    //     const post = await context.prisma.post.findUnique({
    //       where: { id: args.id || undefined },
    //       select: {
    //         published: true,
    //       },
    //     })

    //     if (!post) {
    //       throw new Error(
    //         `Post with ID ${args.id} does not exist in the database.`,
    //       )
    //     }

    //     return context.prisma.post.update({
    //       where: { id: args.id || undefined },
    //       data: { published: !post.published },
    //     })
    //   },
    // })

  //   t.field('incrementPostViewCount', {
  //     type: 'Post',
  //     args: {
  //       id: nonNull(intArg()),
  //     },
  //     resolve: (_, args, context) => {
  //       return context.prisma.post.update({
  //         where: { id: args.id || undefined },
  //         data: {
  //           viewCount: {
  //             increment: 1,
  //           },
  //         },
  //       })
  //     },
  //   })

  //   t.field('deletePost', {
  //     type: 'Post',
  //     args: {
  //       id: nonNull(intArg()),
  //     },
  //     resolve: (_, args, context) => {
  //       return context.prisma.post.delete({
  //         where: { id: args.id },
  //       })
  //     },
  //   })
  },
})

const Product = objectType({
  name: 'Product',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('title')
    t.nonNull.int('price')
    t.nonNull.string('description')
    t.string('image')
    t.nonNull.list.nonNull.field('categories', {
      type: 'Category',
      resolve: (parent, _, context) => {
        return context.prisma.product
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .Category()
      },
    })
  },
})

const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('description')
    t.field('product', {
      type: 'Product',
      resolve: (parent, _, context) => {
        return context.prisma.category
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .product()
      },
    })
  },
})

// const SortOrder = enumType({
//   name: 'SortOrder',
//   members: ['asc', 'desc'],
// })

// const PostOrderByUpdatedAtInput = inputObjectType({
//   name: 'PostOrderByUpdatedAtInput',
//   definition(t) {
//     t.nonNull.field('updatedAt', { type: 'SortOrder' })
//   },
// })

// const UserUniqueInput = inputObjectType({
//   name: 'UserUniqueInput',
//   definition(t) {
//     t.int('id')
//     t.string('email')
//   },
// })

const CategoryCreateInput = inputObjectType({
  name: 'CategoryCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('description')
  },
})

// const UserCreateInput = inputObjectType({
//   name: 'UserCreateInput',
//   definition(t) {
//     t.nonNull.string('email')
//     t.string('name')
//     t.list.nonNull.field('posts', { type: 'PostCreateInput' })
//   },
// })

const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Category,
    Product,
    // UserUniqueInput,
    // UserCreateInput,
    CategoryCreateInput,
    // SortOrder,
    // PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

module.exports = {
  schema: schema,
}
