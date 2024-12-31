"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// QueryBuilder for Mongoose queries.
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // Adds search conditions to query.
    search(searchAbleFileds) {
        var _a;
        const search = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search;
        if (search) {
            this.modelQuery = this.modelQuery.find({
                $or: searchAbleFileds.map(filed => ({
                    [filed]: { $regex: search, $options: 'i' }
                }))
            });
        }
        return this;
    }
    //Applies filters to the query.
    filter(key) {
        var _a;
        const queryObj = Object.assign({}, this.query);
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.filter) {
            queryObj[key] = this.query.filter;
        }
        const excludesFileds = ['search', 'sortBy', 'sortOrder', 'filter'];
        excludesFileds.forEach(el => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    //Adds sorting conditions to query.
    sort() {
        var _a, _b, _c, _d;
        const sortBy = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sortBy) === null || _b === void 0 ? void 0 : _b.split(',')) || ['createdAt'];
        let sortOrder = '-';
        if (((_c = this === null || this === void 0 ? void 0 : this.query) === null || _c === void 0 ? void 0 : _c.sortOrder) === 'asc') {
            sortOrder = '';
        }
        else if (((_d = this === null || this === void 0 ? void 0 : this.query) === null || _d === void 0 ? void 0 : _d.sortOrder) === 'desc') {
            sortOrder = '-';
        }
        const sortString = sortBy
            .map(filed => filed.startsWith('-') || filed.startsWith('+')
            ? filed
            : `${sortOrder}${filed}`)
            .join(' ');
        this.modelQuery = this.modelQuery.sort(sortString);
        return this;
    }
}
exports.default = QueryBuilder;
