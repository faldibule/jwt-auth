const paginate = {
    find: async (model, currentPage, currentLimit) =>{
            const page = currentPage || 1;
            const limit = currentLimit || 3;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const result = {}
            result.message = 'Data'
            result.totalPage = Math.ceil(await model.countDocuments() / limit)
            result.data = await model.find()
                .skip(startIndex)
                .limit(limit)
                .sort({ _id: -1 })
                .populate({ path: "tags", select: "tag" })
                .populate({ path: "user", select: ["nama", "email", "image"] })
                .exec();
            if(endIndex < await model.countDocuments()){
                result.next = {
                    page: page + 1,
                    limit
                }
            }
            if(startIndex > 0){
                result.previous = {
                    page:page - 1,
                    limit
                }
            }
            return result;
    },
    search: async (model, currentPage, currentLimit, keyword) =>{
        const page = currentPage || 1;
        const limit = currentLimit || 3;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {}
        result.message = 'Data'
        result.totalPage = Math.ceil(await model.countDocuments() / limit)
        result.data = await model.find(
            {
              title: {
                $regex: '.*'+keyword+'.*'
              }
            })
            .skip(startIndex)
            .limit(limit)
            .sort({ _id: -1 })
            .populate({ path: "tags", select: "tag" })
            .populate({ path: "user", select: ["nama", "email", "image"] })
            .exec();
        if(endIndex < await result.data.length){
            result.next = {
                page: page + 1,
                limit
            }
        }
        if(startIndex > 0){
            result.previous = {
                page:page - 1,
                limit
            }
        }
        return result;
    },
    myPost: async (model, currentPage, currentLimit, userId) =>{
        const page = currentPage || 1;
        const limit = currentLimit || 3;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {}
        result.message = 'Data'
        result.totalPage = Math.ceil(await model.countDocuments() / limit)
        result.data = await model.find({user:userId})
            .skip(startIndex)
            .limit(limit)
            .sort({ _id: -1 })
            .populate({ path: "tags", select: "tag" })
            .populate({ path: "user", select: ["nama", "email", "image"] })
            .exec();
        if(endIndex < await model.countDocuments({user:userId})){
            result.next = {
                page: page + 1,
                limit
            }
        }
        if(startIndex > 0){
            result.previous = {
                page:page - 1,
                limit
            }
        }
        return result;
    },
}
module.exports = paginate;