/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst helmet = __webpack_require__(/*! helmet */ \"helmet\");\nconst cors = __webpack_require__(/*! cors */ \"cors\");\nconst morgan = __webpack_require__(/*! morgan */ \"morgan\");\nconst multer = __webpack_require__(/*! multer */ \"multer\");\nconst { trim_all } = __webpack_require__(/*! request_trimmer */ \"request_trimmer\");\nvar upload = multer();\n\nconst app = express();\nconst apiRoutes = __webpack_require__(/*! ./routes/api/index.routes */ \"./src/routes/api/index.routes.js\");\nconst { errorConverter, handleError, handleNotFound } = __webpack_require__(/*! ./middlewares/error.middleware */ \"./src/middlewares/error.middleware.js\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst { notificationHandle } = __webpack_require__(/*! ./services/notification.service */ \"./src/services/notification.service.js\");\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\nconst port = process.env.PORT || 5000;\n\nglobal.__basedir = __dirname;\n//http request log\nif (true) {\n    app.use(morgan(\"combined\"));\n}\n//Set static folder\napp.use(express.static(path.join(__dirname + \"/public\")));\n//set security HTTP headers\napp.use(helmet());\n//parse json request body\napp.use(express.json());\n//parse urlencoded request body\napp.use(express.urlencoded({ extended: true }));\n//trim request params\napp.use(trim_all);\n//enable cors\napp.use(cors());\napp.options(\"*\", cors());\n//routes\napp.use(\"/api\", apiRoutes);\n//handle error\napp.use(errorConverter);\napp.use(handleError);\napp.use(handleNotFound);\napp.listen(port, () => {\n    notificationHandle();\n    console.log(`Server listening on port ${port}`);\n});\n\n\n//# sourceURL=webpack://backend/./src/app.js?");

/***/ }),

/***/ "./src/config/db.config.js":
/*!*********************************!*\
  !*** ./src/config/db.config.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\n\nconst databaseConfig = {\n    host: process.env.DB_HOST,\n    user: process.env.DB_USER,\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME,\n};\n\nmodule.exports = databaseConfig;\n\n\n//# sourceURL=webpack://backend/./src/config/db.config.js?");

/***/ }),

/***/ "./src/controllers/auth.controller.js":
/*!********************************************!*\
  !*** ./src/controllers/auth.controller.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { createToken } = __webpack_require__(/*! ../services/jsonwebtoken.service */ \"./src/services/jsonwebtoken.service.js\");\nconst userService = __webpack_require__(/*! ../services/user.service */ \"./src/services/user.service.js\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\n\nconst register = (req, res, next) => {\n    console.log(req.value);\n};\nconst login = async (req, res) => {\n    try {\n        const user = await userService.getUserByPhone({ phone: req.value.phone_number });\n        await userService.checkPassword(user.password, req.value.password);\n        const token = createToken(\n            process.env.SECRET_KEY,\n            {\n                id: user.id,\n                name: user.name,\n                email: user.email,\n                phone: user.phone,\n                role: user.role_name,\n            },\n            \"60days\"\n        );\n        delete user.password;\n        await userService.addDeviceToken(user.id, req.value.deviceToken);\n        return res.status(200).json(response({ info: user, access_token: token }, \"Success \", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst logout = async (req, res) => {\n    try {\n        await userService.deleteToken(req.user.id, req.value.deviceToken);\n        return res.status(200).json(response({}, \"Đăng xuất thành công.\", 0));\n    } catch (error) {\n        console.log(error);\n        return res.status(200).json(response({}, error.message, 0));\n    }\n};\n\nmodule.exports = { register, login, logout };\n\n\n//# sourceURL=webpack://backend/./src/controllers/auth.controller.js?");

/***/ }),

/***/ "./src/controllers/car.controller.js":
/*!*******************************************!*\
  !*** ./src/controllers/car.controller.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const httpStatus = __webpack_require__(/*! http-status */ \"http-status\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\nconst carService = __webpack_require__(/*! ../services/car.service */ \"./src/services/car.service.js\");\nconst uploadFile = __webpack_require__(/*! ../utils/saveImage */ \"./src/utils/saveImage.js\");\nconst { deleteFiles, deleteImages } = __webpack_require__(/*! ../utils/deleteFiles */ \"./src/utils/deleteFiles.js\");\nconst { newCarSchema } = __webpack_require__(/*! ../validations/car.validate */ \"./src/validations/car.validate.js\");\n\nconst getCarsForUser = async (req, res) => {\n    try {\n        const user = req.user;\n        const cars = await carService.getCarsForUser(user.id);\n        return res\n            .status(200)\n            .json(response({ rows: cars, recordsTotal: cars.length }, \"Success\", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\nconst createNewCar = async (req, res) => {\n    try {\n        await uploadFile(req, res);\n        if (!req.files.length) {\n            return res.status(400).json(response({}, \"Vui lòng thêm ảnh.\", 0));\n        }\n        const { value, error } = newCarSchema.validate(req.body);\n        if (error) return res.status(200).json(response({}, error.message, 0));\n        req.body.license_plate = req.body.license_plate.trim();\n        await carService.checkCarExist(req.body.license_plate);\n        const { insertId } = await carService.addNewCar(req, res);\n        await carService.addImagesForCar(req.files, insertId);\n        return res.status(200).json(response({}, \"Thêm xe thành công.\", 1));\n    } catch (error) {\n        console.log(\"Error\", error);\n        deleteFiles(req.files);\n        return res.status(200).json(response({}, error.message || \"Lỗi máy chủ.\", 0));\n    }\n};\n\nconst updateCar = async (req, res) => {\n    try {\n        await uploadFile(req, res);\n        if (!req.files.length) {\n            return res.status(400).json(response({}, \"Vui lòng thêm ảnh.\", 0));\n        }\n        const { value, error } = newCarSchema.validate(req.body);\n        if (error) return res.status(200).json(response({}, error.message, 0));\n        req.body.license_plate = req.body.license_plate.trim();\n        const images = await carService.getCarImagesWithId(req.car.id);\n        await carService.updateCar(req);\n        deleteImages(images);\n        await carService.deleteAllImagesForCar(req.car.id);\n        await carService.addImagesForCar(req.files, req.car.id);\n        res.status(200).json(response({}, \"Cập  nhật thành công\"));\n    } catch (error) {\n        console.log(error);\n        return res.status(200).json(response({}, error.message, 0));\n    }\n};\n\nconst deleteCar = async (req, res) => {\n    try {\n        await carService.deleteCar(req.value.carId);\n        return res.status(200).json(response({}, \"Xóa thành công\", 0));\n    } catch (error) {\n        return res.status(200).json(response({}, error.message, 0));\n    }\n};\n\nconst checkRegisteredForCar = async (req, res) => {\n    try {\n        const { carId } = req.params;\n        await carService.getRegistryNoCompleted(carId);\n        return res.status(200).json(response({ isValid: true }, \"Success\", 1));\n    } catch (error) {\n        return res\n            .status(200)\n            .json(response({ isValid: false }, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst checkErrorById = async (req, res) => {\n    try {\n        const { carId } = req.params;\n        await carService.checkErrorWithId(carId);\n        return res.status(200).json(response({ isValid: true }, \"Success\", 1));\n    } catch (error) {\n        return res\n            .status(200)\n            .json(response({ isValid: false }, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst getErrorById = async (req, res) => {\n    try {\n        const { carId } = req.params;\n        const errors = await carService.getAllErrorById(carId);\n        return res\n            .status(200)\n            .json(response({ rows: errors, recordsTotal: errors.length }, \"Success\", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst getErrorByLicensePlate = async (req, res) => {\n    try {\n        const { licensePlate } = req.value;\n        const infringes = await carService.getAllErrorByLicensePlate(licensePlate);\n        return res\n            .status(200)\n            .json(response({ rows: infringes, recordsTotal: infringes.length }, \"Success\", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst getCategories = async (req, res, next) => {\n    try {\n        const categories = await carService.getCategories();\n        return res\n            .status(200)\n            .json(response({ rows: categories, recordsTotal: categories.length }, \"Success\", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst getCarType = async (req, res, next) => {\n    try {\n        const types = await carService.getCarTypes(req.value.categoryId);\n        return res\n            .status(200)\n            .json(response({ rows: types, recordsTotal: types.length }, \"Success\", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst getCarInformationWithId = async (req, res) => {\n    try {\n        const info = await carService.getCarInformation(req.value.carId, req.user.id);\n        const images = await carService.getCarImagesWithId(req.value.carId);\n        return res.status(200).json(response({ ...info, display_images: images }, \"Success\", 1));\n    } catch (error) {\n        console.log(error);\n        return res.status(500).json(response({}, error.message || \"Lỗi không xác định\", 0));\n    }\n};\n\nmodule.exports = {\n    getCarsForUser,\n    createNewCar,\n    checkRegisteredForCar,\n    checkErrorById,\n    getErrorById,\n    getCategories,\n    getCarType,\n    getErrorByLicensePlate,\n    getCarInformationWithId,\n    updateCar,\n    deleteCar,\n};\n\n\n//# sourceURL=webpack://backend/./src/controllers/car.controller.js?");

/***/ }),

/***/ "./src/controllers/notification.controller.js":
/*!****************************************************!*\
  !*** ./src/controllers/notification.controller.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { getAllNotifications } = __webpack_require__(/*! ../services/notification.service */ \"./src/services/notification.service.js\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\n\nconst getNotifications = async (req, res, next) => {\n    try {\n        const user = req.user;\n        const limit = req.query.limit || 10;\n        const page = req.query.page || 1;\n        const notifications = await getAllNotifications(user.id, limit, page);\n        return res\n            .status(200)\n            .json(\n                response({ rows: notifications, recordsTotal: notifications.length }, \"Success\", 1)\n            );\n    } catch (error) {\n        return res.status(500).json(response({}, error.message, 0));\n    }\n};\n\nmodule.exports = { getNotifications };\n\n\n//# sourceURL=webpack://backend/./src/controllers/notification.controller.js?");

/***/ }),

/***/ "./src/controllers/registry.controller.js":
/*!************************************************!*\
  !*** ./src/controllers/registry.controller.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const httpStatus = __webpack_require__(/*! http-status */ \"http-status\");\nconst carService = __webpack_require__(/*! ../services/car.service */ \"./src/services/car.service.js\");\nconst registryService = __webpack_require__(/*! ../services/registry.service */ \"./src/services/registry.service.js\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\nconst dateConvert = __webpack_require__(/*! ../utils/dateConvert */ \"./src/utils/dateConvert.js\");\n\nconst getRegistries = async (req, res, next) => {\n    try {\n        const user = req.user;\n        const limit = req.query.limit || 10;\n        const page = req.query.page || 1;\n        const registries = await registryService.getRegistriesByUser(user.id, limit, page);\n        return res.status(httpStatus.OK).json(response(registries, \"Success\", 1));\n    } catch (error) {\n        res.status(500).json(response({}, error.message || \"Lỗi máy chủ\", 0));\n    }\n};\n\nconst costCalculation = async (req, res) => {\n    try {\n        const data = req.value;\n        const serviceCost = registryService.calculationServiceCost(data.address);\n        const feeRegistration = await registryService.getFeeWithCarId(data.carId);\n        const rate_fee = await registryService.getRateFee(data.carId);\n        return res.status(httpStatus.OK).json(\n            response({\n                fee: {\n                    tariff: feeRegistration.tariff,\n                    license_fee: feeRegistration.tariff,\n                    serviceCost: serviceCost,\n                },\n                rateFee: { rows: rate_fee, recordsTotal: rate_fee.length },\n            })\n        );\n    } catch (error) {\n        return res.status(200).json(response({}, error.message, 0));\n    }\n};\n\nconst addNewRegistry = async (req, res) => {\n    try {\n        const { address, carId, date } = req.value;\n        await carService.checkErrorWithId(carId);\n        await carService.getRegistryNoCompleted(carId);\n        const serviceCost = registryService.calculationServiceCost(address);\n        const feeRegistration = await registryService.getFeeForRegistry(carId, req.value.feeTime);\n        const car = await carService.getCarWithId(carId);\n        const registryId = await registryService.addNewRegistry({\n            owner_id: req.user.id,\n            license_plate: car.license_plates,\n            vehicle_type_id: car.vehicle_type_id,\n            address: address ? `'${address}'` : null,\n            date: dateConvert(date),\n            owner_name: req.user.name,\n            owner_phone: req.user.phone,\n        });\n        await registryService.addBillForRegistry(\n            feeRegistration.tariff,\n            feeRegistration.license_fee,\n            feeRegistration.road_fee,\n            serviceCost,\n            registryId\n        );\n        return res.status(200).json(response({}, \"Đăng ký thành công\", 1));\n    } catch (error) {\n        console.log(error);\n        return res.status(200).json(response({}, error.message, 0));\n    }\n};\n\nconst getRegistriesInFuture = async (req, res) => {\n    try {\n        const dates = await registryService.getRegistriesFuture(req.user.id);\n        return res.status(200).json(response({ rows: dates }, \"Success\", 1));\n    } catch (error) {\n        return res.status(500).json(response({}, error.message, 0));\n    }\n};\n\nconst getRegistriesWithDate = async (req, res) => {\n    try {\n        const { date } = req.value;\n        const registries = await registryService.getRegistriesByDate(\n            dateConvert(date),\n            req.user.id\n        );\n        return res\n            .status(200)\n            .json(response({ rows: registries, recordsTotal: registries.length }, \"Success\", 1));\n    } catch (error) {\n        console.log(error);\n        return res.status(500).json(response({}, \"Lỗi máy chủ\", 0));\n    }\n};\nmodule.exports = {\n    getRegistries,\n    costCalculation,\n    addNewRegistry,\n    getRegistriesInFuture,\n    getRegistriesWithDate,\n};\n\n\n//# sourceURL=webpack://backend/./src/controllers/registry.controller.js?");

/***/ }),

/***/ "./src/middlewares/auth.middleware.js":
/*!********************************************!*\
  !*** ./src/middlewares/auth.middleware.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const httpStatus = __webpack_require__(/*! http-status */ \"http-status\");\nconst { verifyToken } = __webpack_require__(/*! ../services/jsonwebtoken.service */ \"./src/services/jsonwebtoken.service.js\");\nconst ApiError = __webpack_require__(/*! ../utils/ApiError */ \"./src/utils/ApiError.js\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\n\nconst checkUser = (req, res, next) => {\n    const { authorization } = req.headers;\n    if (!authorization) {\n        return res.status(httpStatus.UNAUTHORIZED).json(response({}, \"Không có quyền truy cập\", 0));\n    }\n    const token = authorization.split(\" \")[1];\n    const verify = verifyToken(process.env.SECRET_KEY, token);\n    if (verify.err) {\n        return res.status(httpStatus.UNAUTHORIZED).json(response({}, \"Không có quyền truy cập\", 0));\n    }\n    req.user = verify.user;\n    next();\n};\n\nmodule.exports = { checkUser };\n\n\n//# sourceURL=webpack://backend/./src/middlewares/auth.middleware.js?");

/***/ }),

/***/ "./src/middlewares/checkCar.middleware.js":
/*!************************************************!*\
  !*** ./src/middlewares/checkCar.middleware.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const query = __webpack_require__(/*! ../model/query.model */ \"./src/model/query.model.js\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\n\nconst checkCar = async (req, res, next) => {\n    const carId = req.query.carId || req.body.carId || req.params.carId;\n    const { id } = req.user;\n    try {\n        const car = await query(\n            `SELECT * FROM cars WHERE cars.id = ${carId} and cars.owner_id = ${id} and cars.delete_at is null;`\n        );\n        if (!car.length) {\n            return res.status(400).json(response({}, \"Không có quyền truy cập\"));\n        }\n        req.car = car[0];\n        next();\n    } catch (error) {\n        console.log(error);\n        return res.status(400).json(response({}, error.message, 0));\n    }\n};\nmodule.exports = checkCar;\n\n\n//# sourceURL=webpack://backend/./src/middlewares/checkCar.middleware.js?");

/***/ }),

/***/ "./src/middlewares/error.middleware.js":
/*!*********************************************!*\
  !*** ./src/middlewares/error.middleware.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const httpStatus = __webpack_require__(/*! http-status */ \"http-status\");\nconst ApiError = __webpack_require__(/*! ../utils/ApiError */ \"./src/utils/ApiError.js\");\n\nconst handleNotFound = (req, res, next) => {\n    return res.status(httpStatus.NOT_FOUND).json({ status: 0, message: \"Not Found\", data: {} });\n};\n\nconst errorConverter = (err, req, res, next) => {\n    let error = err;\n\n    if (!(error instanceof ApiError)) {\n        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;\n        const message = error.message || httpStatus[statusCode];\n        error = new ApiError(statusCode, message);\n    }\n    return next(error);\n};\n\nconst handleError = (err, req, res, next) => {\n    let { statusCode, message } = err;\n    if ( true && !err.isOperational) {\n        statusCode = httpStatus.INTERNAL_SERVER_ERROR;\n        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];\n    }\n    const response = {\n        code: statusCode,\n        message,\n        status: 0,\n        ...( true && { stack: err.stack }),\n    };\n    if (true) {\n        // console.log(err);\n    }\n    return res.status(statusCode).json(response);\n};\nmodule.exports = { errorConverter, handleError, handleNotFound };\n\n\n//# sourceURL=webpack://backend/./src/middlewares/error.middleware.js?");

/***/ }),

/***/ "./src/middlewares/validate.middleware.js":
/*!************************************************!*\
  !*** ./src/middlewares/validate.middleware.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const httpStatus = __webpack_require__(/*! http-status */ \"http-status\");\nconst ApiError = __webpack_require__(/*! ../utils/ApiError */ \"./src/utils/ApiError.js\");\n\nconst validator = (schema, data) => (req, res, next) => {\n    const { value, error } = schema.validate(req[data]);\n    if (error) {\n        const message = error.details.map((detail) => detail.message).join(\",\");\n        console.log(error);\n        return next(new ApiError(httpStatus.BAD_REQUEST, message));\n    }\n    req.value = value;\n    return next();\n};\n\nmodule.exports = validator;\n\n\n//# sourceURL=webpack://backend/./src/middlewares/validate.middleware.js?");

/***/ }),

/***/ "./src/model/connection.model.js":
/*!***************************************!*\
  !*** ./src/model/connection.model.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mysql = __webpack_require__(/*! mysql2 */ \"mysql2\");\nconst databaseConfig = __webpack_require__(/*! ../config/db.config */ \"./src/config/db.config.js\");\n\nconst connection = mysql.createConnection({\n    host: databaseConfig.host,\n    user: databaseConfig.user,\n    password: databaseConfig.password,\n    database: databaseConfig.database,\n    multipleStatements: true,\n    dateStrings: true,\n});\n\nconnection.connect((err) => {\n    if (err) {\n        console.log(err.message);\n    }\n    console.log(\"Connection successful\");\n});\n\nmodule.exports = connection;\n\n\n//# sourceURL=webpack://backend/./src/model/connection.model.js?");

/***/ }),

/***/ "./src/model/query.model.js":
/*!**********************************!*\
  !*** ./src/model/query.model.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const connection = __webpack_require__(/*! ./connection.model */ \"./src/model/connection.model.js\");\n\nconst query = (sql) => {\n    return new Promise((resolve, reject) => {\n        connection.query(sql, (err, data) => {\n            if (err) {\n                reject(err);\n            }\n            resolve(data);\n        });\n    });\n};\n\nmodule.exports = query;\n\n\n//# sourceURL=webpack://backend/./src/model/query.model.js?");

/***/ }),

/***/ "./src/routes/api/auth.routes.js":
/*!***************************************!*\
  !*** ./src/routes/api/auth.routes.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\n\nconst authMiddleware = __webpack_require__(/*! ../../middlewares/auth.middleware */ \"./src/middlewares/auth.middleware.js\");\nconst validator = __webpack_require__(/*! ../../middlewares/validate.middleware */ \"./src/middlewares/validate.middleware.js\");\nconst { registerSchema, loginSchema, logoutSchema } = __webpack_require__(/*! ../../validations/auth.validation */ \"./src/validations/auth.validation.js\");\nconst authController = __webpack_require__(/*! ../../controllers/auth.controller */ \"./src/controllers/auth.controller.js\");\nconst router = express.Router();\n\nrouter.post(\"/register\", validator(registerSchema, \"body\"), authController.register);\nrouter.post(\"/login\", validator(loginSchema, \"body\"), authController.login);\nrouter.post(\n    \"/logout\",\n    authMiddleware.checkUser,\n    validator(logoutSchema, \"body\"),\n    authController.logout\n);\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://backend/./src/routes/api/auth.routes.js?");

/***/ }),

/***/ "./src/routes/api/car.routes.js":
/*!**************************************!*\
  !*** ./src/routes/api/car.routes.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst carController = __webpack_require__(/*! ../../controllers/car.controller */ \"./src/controllers/car.controller.js\");\nconst checkCar = __webpack_require__(/*! ../../middlewares/checkCar.middleware */ \"./src/middlewares/checkCar.middleware.js\");\nconst validator = __webpack_require__(/*! ../../middlewares/validate.middleware */ \"./src/middlewares/validate.middleware.js\");\nconst {\n    carSchema,\n    typeSchema,\n    newCarSchema,\n    licensePlateSchema,\n} = __webpack_require__(/*! ../../validations/car.validate */ \"./src/validations/car.validate.js\");\nconst router = express.Router();\n//validator(newCarSchema, \"body\"),\nrouter.post(\"/\", carController.createNewCar);\nrouter.get(\"/\", carController.getCarsForUser);\nrouter.get(\n    \"/check-registry/:carId\",\n    checkCar,\n    validator(carSchema, \"params\"),\n    carController.checkRegisteredForCar\n);\nrouter.get(\n    \"/check-error-by-id/:carId\",\n    checkCar,\n    validator(carSchema, \"params\"),\n    carController.checkErrorById\n);\n\nrouter.get(\n    \"/errors-by-id/:carId\",\n    checkCar,\n    validator(carSchema, \"params\"),\n    carController.getErrorById\n);\nrouter.get(\n    \"/errors-by-license-plate\",\n    validator(licensePlateSchema, \"query\"),\n    carController.getErrorByLicensePlate\n);\nrouter.get(\"/category\", carController.getCategories);\nrouter.get(\"/types\", validator(typeSchema, \"query\"), carController.getCarType);\nrouter.get(\"/info\", validator(carSchema, \"query\"), carController.getCarInformationWithId);\nrouter.put(\"/info\", checkCar, validator(carSchema, \"query\"), carController.updateCar);\nrouter.delete(\"/info\", checkCar, validator(carSchema, \"query\"), carController.deleteCar);\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://backend/./src/routes/api/car.routes.js?");

/***/ }),

/***/ "./src/routes/api/index.routes.js":
/*!****************************************!*\
  !*** ./src/routes/api/index.routes.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst authRouter = __webpack_require__(/*! ./auth.routes */ \"./src/routes/api/auth.routes.js\");\nconst registryRouter = __webpack_require__(/*! ./registry.routes */ \"./src/routes/api/registry.routes.js\");\nconst carRouter = __webpack_require__(/*! ./car.routes */ \"./src/routes/api/car.routes.js\");\nconst notificationRouter = __webpack_require__(/*! ./notification.routes */ \"./src/routes/api/notification.routes.js\");\nconst authMiddleware = __webpack_require__(/*! ../../middlewares/auth.middleware */ \"./src/middlewares/auth.middleware.js\");\nconst router = express.Router();\n\nconst userRoutes = [{ path: \"/auth\", route: authRouter }];\nconst userPrivateRoutes = [\n    { path: \"/registries\", route: registryRouter },\n    { path: \"/cars\", route: carRouter },\n    { path: \"/notifications\", route: notificationRouter },\n];\nconst employeeRotes = [];\n\nuserRoutes.forEach((route) => {\n    router.use(\"/customer\" + route.path, route.route);\n});\n\nuserPrivateRoutes.forEach((route) => {\n    router.use(\"/customer\" + route.path, authMiddleware.checkUser, route.route);\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://backend/./src/routes/api/index.routes.js?");

/***/ }),

/***/ "./src/routes/api/notification.routes.js":
/*!***********************************************!*\
  !*** ./src/routes/api/notification.routes.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst notificationController = __webpack_require__(/*! ../../controllers/notification.controller */ \"./src/controllers/notification.controller.js\");\nconst routes = express.Router();\n\nroutes.get(\"/\", notificationController.getNotifications);\n\nmodule.exports = routes;\n\n\n//# sourceURL=webpack://backend/./src/routes/api/notification.routes.js?");

/***/ }),

/***/ "./src/routes/api/registry.routes.js":
/*!*******************************************!*\
  !*** ./src/routes/api/registry.routes.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst registryController = __webpack_require__(/*! ../../controllers/registry.controller */ \"./src/controllers/registry.controller.js\");\nconst checkCar = __webpack_require__(/*! ../../middlewares/checkCar.middleware */ \"./src/middlewares/checkCar.middleware.js\");\nconst validator = __webpack_require__(/*! ../../middlewares/validate.middleware */ \"./src/middlewares/validate.middleware.js\");\nconst {\n    costCalculationSchema,\n    registrationSchema,\n    dateSchema,\n} = __webpack_require__(/*! ../../validations/registry.validation */ \"./src/validations/registry.validation.js\");\nconst router = express.Router();\n\nrouter.post(\"\", validator(registrationSchema, \"body\"), checkCar, registryController.addNewRegistry);\nrouter.get(\"/list-registries\", registryController.getRegistries);\nrouter.get(\"/list-registries-future\", registryController.getRegistriesInFuture);\nrouter.get(\n    \"/list-registries-date\",\n    validator(dateSchema, \"query\"),\n    registryController.getRegistriesWithDate\n);\nrouter.post(\n    \"/cost-calculation\",\n    validator(costCalculationSchema, \"body\"),\n    registryController.costCalculation\n);\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://backend/./src/routes/api/registry.routes.js?");

/***/ }),

/***/ "./src/services/car.service.js":
/*!*************************************!*\
  !*** ./src/services/car.service.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { reject } = __webpack_require__(/*! bcrypt/promises */ \"bcrypt/promises\");\nconst connection = __webpack_require__(/*! ../model/connection.model */ \"./src/model/connection.model.js\");\nconst query = __webpack_require__(/*! ../model/query.model */ \"./src/model/query.model.js\");\nconst ApiError = __webpack_require__(/*! ../utils/ApiError */ \"./src/utils/ApiError.js\");\nconst response = __webpack_require__(/*! ../utils/response */ \"./src/utils/response.js\");\n\nclass CarService {\n    getCarsForUser = (userId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const cars = await query(\n                    `SELECT cars.id , vehicle_types.name as type, cars.license_plates,car_images.url as display_image , o.date , o.plan_date FROM registration.cars \n                    inner join registration.vehicle_types on cars.delete_at is null and cars.vehicle_type_id = vehicle_types.id and cars.owner_id =${userId} \n                    LEFT JOIN car_images ON car_images.car_id = cars.id \n                    LEFT JOIN( SELECT registry_managements.license_plate, registry_managements.date , registry_managements.plan_date FROM registry_managements WHERE registry_managements.owner_id = 1 AND status = 2 GROUP BY registry_managements.license_plate) as o ON o.license_plate = cars.license_plates GROUP BY cars.id`\n                );\n                resolve(cars);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getRegistryNoCompleted = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const result = await query(\n                    `select count(*) as count from cars inner join registry_managements on cars.license_plates = registry_managements.license_plate and cars.id = ${carId} and registry_managements.completed_at is  null `\n                );\n                if (result[0].count) {\n                    reject(new Error(\"Xe có đăng kiểm chưa hoàn thành\"));\n                }\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    checkErrorWithId = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const result = await query(\n                    `select count(*) as count from cars \n                inner join infringes on cars.license_plates = infringes.license_plate and cars.id = ${carId} and infringes.status=0`\n                );\n                if (result[0].count) {\n                    reject(new Error(\"Xe có lỗi vi phạm.Vui lòng kiểm tra lại và xử lí\"));\n                }\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getAllErrorById = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const errors = await query(\n                    `select infringes.id, infringes.infringes_name as name , infringes.infringe_date as date ,infringes.handling_agency as handlingAgency    from infringes\n                inner join cars on cars.license_plates = infringes.license_plate and cars.id = ${carId} and infringes.status=0`\n                );\n                resolve(errors);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getAllErrorByLicensePlate = (licensePlate) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const infringes = await query(\n                    `select infringes.id, infringes.infringes_name as name , infringes.infringe_date as date,infringes.handling_agency as handlingAgency  from infringes where infringes.license_plate = '${licensePlate}' and  infringes.status=0`\n                );\n                resolve(infringes);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getCategories = () => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const categories = await query(\"select id , name from vehicle_categories\");\n                resolve(categories);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getCarTypes = async (categoryId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const types = await query(\n                    `select id , name from vehicle_types where vehicle_category_id=${categoryId}`\n                );\n                resolve(types);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    checkCarExist = (license_plate) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const car = await query(\n                    `select count(*) as count from cars where license_plates = '${license_plate}' and delete_at is null`\n                );\n                if (car[0].count) {\n                    reject(\n                        new Error(\n                            \"Xe đã tồn tại.Vui lòng kiểm tra lại hoặc liên hệ để được hỗ trợ.\"\n                        )\n                    );\n                }\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    updateCar = async (req) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const { carId } = req.query;\n                const { license_plate, type, manufacture_at } = req.body;\n                const car = await query(\n                    `update cars set  license_plates= '${license_plate}' ,vehicle_type_id = ${type} , manufacture_at= ${manufacture_at} where cars.id = ${carId} `\n                );\n                return resolve(car);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    addImagesForCar = (images, id) => {\n        return new Promise(async (resolve, reject) => {\n            connection.query(\n                \"insert into  car_images(car_id ,url) value  ?\",\n                [images.map((image) => [id, `images/${image.filename}`])],\n                (error, results, fields) => {\n                    if (error) {\n                        return reject(error);\n                    }\n                    return resolve(\"success\");\n                }\n            );\n        });\n    };\n\n    deleteAllImagesForCar = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                await query(`delete from car_images where car_id = ${carId}`);\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    deleteCar = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                await query(\n                    `update cars set delete_at = CURRENT_TIMESTAMP where cars.id = ${carId}`\n                );\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    addNewCar = (req) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const { id } = req.user;\n                const { license_plate, type, manufacture_at } = req.body;\n                const car = await query(\n                    `insert into cars(owner_id , license_plates ,vehicle_type_id , manufacture_at) VALUES (${id} , '${license_plate}' , ${type} , ${manufacture_at})`\n                );\n                return resolve(car);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getCarInformation = (carId, userId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const result =\n                    await query(`SELECT cars.id ,cars.license_plates ,cars.manufacture_at , vehicle_types.name as type ,vehicle_categories.name as category FROM  cars \n                    INNER JOIN vehicle_types ON cars.vehicle_type_id = vehicle_types.id  AND cars.id = ${carId} AND cars.owner_id = ${userId}\n                    INNER JOIN vehicle_categories on vehicle_categories.id =vehicle_types.vehicle_category_id;`);\n                if (!result.length) return reject(new Error(\"Xe không tồn tại.\"));\n                resolve(result[0]);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getCarImagesWithId = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const images = await query(\n                    `SELECT  url from car_images where car_images.car_id= ${carId}`\n                );\n                resolve(images);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getCarWithId = async (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const car = await query(`SELECT * FROM cars where cars.id =${carId} limit 1`);\n                resolve(car[0]);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n}\n\nconst carService = new CarService();\nmodule.exports = carService;\n\n\n//# sourceURL=webpack://backend/./src/services/car.service.js?");

/***/ }),

/***/ "./src/services/crypt.service.js":
/*!***************************************!*\
  !*** ./src/services/crypt.service.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n\nconst decode = (code, data) => {\n    const hash = bcrypt.compareSync(data, code);\n    return hash;\n};\n\nmodule.exports = { decode };\n\n\n//# sourceURL=webpack://backend/./src/services/crypt.service.js?");

/***/ }),

/***/ "./src/services/jsonwebtoken.service.js":
/*!**********************************************!*\
  !*** ./src/services/jsonwebtoken.service.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { NOT_EXTENDED } = __webpack_require__(/*! http-status */ \"http-status\");\nvar jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst { token } = __webpack_require__(/*! morgan */ \"morgan\");\n\nconst createToken = (secret_key, data, expiresIn) => {\n    return jwt.sign(data, secret_key, {\n        algorithm: \"HS256\",\n        expiresIn: expiresIn,\n    });\n};\n\nconst verifyToken = (secret_key, token) => {\n    try {\n        const decode = jwt.verify(token, secret_key);\n        return {\n            error: null,\n            user: decode,\n        };\n    } catch (error) {\n        return { err: error };\n    }\n};\n\nmodule.exports = { createToken, verifyToken };\n\n\n//# sourceURL=webpack://backend/./src/services/jsonwebtoken.service.js?");

/***/ }),

/***/ "./src/services/notification.service.js":
/*!**********************************************!*\
  !*** ./src/services/notification.service.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const query = __webpack_require__(/*! ../model/query.model */ \"./src/model/query.model.js\");\nconst CronJob = __webpack_require__(/*! node-cron */ \"node-cron\");\nconst { Expo } = __webpack_require__(/*! expo-server-sdk */ \"expo-server-sdk\");\n\nconst notificationHandle = async () => {\n    const scheduledNotifications = CronJob.schedule(\"0 * * * * *\", async () => {\n        const timeConfig = await getTimeSendNotification();\n        const date = new Date();\n        if (`${date.getHours()}:${date.getMinutes()}:00` === timeConfig[0].time) {\n            const registryDevice = await getDeviceForRegistry(timeConfig[0].day_before_registry);\n            const expiredDevice = await getDeviceForExpired(timeConfig[0].day_before_expired);\n            sendNotification(handleDataMessage(registryDevice, \"REGISTRY\"));\n            sendNotification(handleDataMessage(expiredDevice, \"EXPIRED\"));\n        }\n    });\n\n    scheduledNotifications.start();\n};\nconst getAllNotifications = (userId, limit, page) => {\n    return new Promise(async (resolve, reject) => {\n        try {\n            const notifications = await query(\n                `SELECT id , notification_type_id as type ,content, is_read , create_at as time FROM notifications WHERE user_id = ${userId} ORDER BY notifications.create_at DESC LIMIT ${limit} OFFSET ${\n                    (page - 1) * limit\n                };`\n            );\n            resolve(notifications);\n        } catch (error) {\n            reject(error);\n        }\n    });\n};\n\nconst getTimeSendNotification = () => {\n    return new Promise(async (resolve, reject) => {\n        try {\n            const config = await query(\n                \"SELECT notification_setting.day_before_registry , notification_setting.day_before_expired , notification_setting.time FROM `notification_setting` limit 1;\"\n            );\n            resolve(config);\n        } catch (error) {\n            reject(error);\n        }\n    });\n};\n\nconst getDeviceForRegistry = async (time) => {\n    return new Promise(async (resolve, reject) => {\n        try {\n            const devices =\n                await query(`SELECT device_tokens.token , registry_managements.license_plate , registry_managements.date FROM device_tokens INNER JOIN registry_managements on registry_managements.owner_id=device_tokens.user_id and registry_managements.completed_at is null and datediff( registry_managements.date,CURRENT_DATE)>0 AND datediff( registry_managements.date,CURRENT_DATE)<${time} GROUP BY registry_managements.license_plate , device_tokens.token;\n    `);\n            resolve(devices);\n        } catch (error) {\n            reject(error);\n        }\n    });\n};\n\nconst getDeviceForExpired = async (time) => {\n    try {\n        const devices =\n            await query(`SELECT device_tokens.token , registry_managements.license_plate , registry_managements.plan_date as date FROM device_tokens INNER JOIN registry_managements ON registry_managements.owner_id = device_tokens.user_id AND datediff(registry_managements.plan_date , CURRENT_DATE) >=0 AND datediff(registry_managements.plan_date , CURRENT_DATE)<${time} GROUP BY registry_managements.license_plate, device_tokens.token;\n    `);\n        resolve(devices);\n    } catch (error) {\n        reject(error);\n    }\n};\n\nconst sendNotification = (data) => {\n    let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });\n    let messages = [];\n    for (let push of data) {\n        if (!Expo.isExpoPushToken(push.token)) {\n            console.error(`Push token ${push.token} is not a valid Expo push token`);\n            continue;\n        }\n\n        messages.push({\n            to: push.token,\n            sound: \"default\",\n            title: push.title,\n            body: push.body,\n            data: { withSome: \"data\" },\n        });\n    }\n\n    let chunks = expo.chunkPushNotifications(messages);\n    let tickets = [];\n    (async () => {\n        for (let chunk of chunks) {\n            try {\n                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);\n                console.log(ticketChunk);\n                tickets.push(...ticketChunk);\n            } catch (error) {\n                console.error(error);\n            }\n        }\n    })();\n};\n\nconst handleDataMessage = (data, type) => {\n    const result = [];\n    switch (type) {\n        case \"REGISTRY\": {\n            data.forEach((a) => {\n                const date = new Date(a.date);\n                result.push({\n                    title: \"Nhắc lịch đăng kiểm\",\n                    body: `Xe ${a.license_plate} có lịch đăng kiểm vào ngày ${date.getDate()}/${\n                        date.getMonth() + 1\n                    }/${date.getFullYear()}.`,\n                    token: a.token,\n                });\n            });\n            break;\n        }\n        case \"EXPIRED\": {\n            console.log(data.length);\n            data.forEach((a) => {\n                const date = new Date(a.date);\n                result.push({\n                    title: \"Xe hết hạn đăng kiểm\",\n                    body: `Xe ${a.license_plate} sẽ hết hạn đăng kiểm vào ngày  ${date.getDate()}/${\n                        date.getMonth() + 1\n                    }/${date.getFullYear()}.`,\n                    token: a.token,\n                });\n            });\n            break;\n        }\n    }\n    return result;\n};\nmodule.exports = { getAllNotifications, notificationHandle };\n\n\n//# sourceURL=webpack://backend/./src/services/notification.service.js?");

/***/ }),

/***/ "./src/services/registry.service.js":
/*!******************************************!*\
  !*** ./src/services/registry.service.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const query = __webpack_require__(/*! ../model/query.model */ \"./src/model/query.model.js\");\nconst ApiError = __webpack_require__(/*! ../utils/ApiError */ \"./src/utils/ApiError.js\");\n\nclass RegistryService {\n    getRegistriesByUser = (userId, limit, page) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const data = {};\n                const registries = await query(\n                    `select registry_managements.id , registry_managements.license_plate, registry_managements.address as registration_for, registry_managements.is_pay as status , vehicle_categories.name as type,car_images.url as display_image,\n                o.cost, date(registry_managements.date ) as date , date(p.completed_at) as completed_at\n                from registry_managements \n                inner join vehicle_types on registry_managements.vehicle_type_id= vehicle_types.id and registry_managements.owner_id=${userId} AND registry_managements.completed_at IS null\n                inner join vehicle_categories on vehicle_categories.id=vehicle_types.vehicle_category_id\n                inner join cars ON cars.license_plates = registry_managements.license_plate and cars.delete_at is null\n                left join car_images ON car_images.car_id =cars.id\n                LEFT join (SELECT * FROM registry_managements WHERE registry_managements.completed_at IS NOT NULL ORDER BY registry_managements.completed_at DESC limit 1) as p on p.license_plate = cars.license_plates\n                inner join (select bills.registry_id, sum(bills.fee) as cost from bills  group by registry_id )as o on o.registry_id=registry_managements.id and o.registry_id=registry_managements.id GROUP BY registry_managements.id\n                order by registry_managements.date desc LIMIT ${limit} OFFSET ${(page - 1) * limit}`\n                );\n                data.rows = this.sortRegistriesWithDay(registries);\n                data.recordsTotal = registries.length;\n                resolve(data);\n            } catch (err) {\n                reject(err);\n            }\n        });\n    };\n\n    sortRegistriesWithDay = (registries) => {\n        const result = [];\n        const key = [];\n        registries.map((registry) => {\n            if (key.includes(registry.date)) {\n                result[result.length - 1].list_registration.push(registry);\n                return;\n            }\n            result.push({});\n            key.push(registry.date);\n            result[result.length - 1].date = registry.date;\n            result[result.length - 1].list_registration = [registry];\n            return;\n        });\n        return result;\n    };\n\n    calculationServiceCost = (address) => {\n        if (!address) return 0;\n        return 100000;\n    };\n\n    getFeeWithCarId = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const fees = await query(\n                    `select cars.license_plates , vehicle_categories.tariff, vehicle_categories.license_fee , rate_fees.fee as road_fee from cars \n                inner join vehicle_types on cars.vehicle_type_id = vehicle_types.id and cars.id=${carId} inner join vehicle_categories on vehicle_categories.id = vehicle_types.vehicle_category_id \n                INNER JOIN rate_fees on rate_fees.vehicle_type_id = vehicle_types.id ;`\n                );\n                if (!fees.length) reject(new Error(\"Không tìm thấy xe này\"));\n                resolve(fees[0]);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getFeeForRegistry = async (carId, time) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const fees = await query(\n                    `select cars.license_plates , vehicle_categories.tariff, vehicle_categories.license_fee , rate_fees.fee as road_fee from cars \n                inner join vehicle_types on cars.vehicle_type_id = vehicle_types.id and cars.id=${carId} inner join vehicle_categories on vehicle_categories.id = vehicle_types.vehicle_category_id \n                INNER JOIN rate_fees on rate_fees.vehicle_type_id = vehicle_types.id AND rate_fees.time = ${time};`\n                );\n                if (!fees.length) reject(new Error(\"Lỗi data\"));\n                resolve(fees[0]);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getRateFee = (carId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const fees = await query(\n                    `select rate_fees.time,rate_fees.fee from rate_fees\n                inner join vehicle_types on rate_fees.vehicle_type_id = vehicle_types.id\n                inner join cars on cars.vehicle_type_id = vehicle_types.id  and cars.id=${carId} GROUP BY  rate_fees.time`\n                );\n                resolve(fees);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    addNewRegistry = ({\n        owner_id,\n        license_plate,\n        vehicle_type_id,\n        address,\n        date,\n        owner_name,\n        owner_phone,\n    }) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const add = await query(\n                    `INSERT INTO registry_managements(owner_id , license_plate ,vehicle_type_id , address , date , owner_name , owner_phone ) VALUES ('${owner_id}', '${license_plate}','${vehicle_type_id}',${address}, '${date}' , '${owner_name}', '${owner_phone}');`\n                );\n                resolve(add.insertId);\n            } catch (error) {\n                reject(new Error(error));\n            }\n        });\n    };\n\n    addBillForRegistry = (tariff, licenseFee, roadFee, serviceCost, registryId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                await query(\n                    `INSERT INTO bills(fee , fee_type_id , registry_id) VALUES (${tariff} ,1 , ${registryId} ),(${serviceCost} ,2 , ${registryId} ), (${roadFee} ,3 , ${registryId} ), (${licenseFee} ,4 , ${registryId} )`\n                );\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getRegistriesFuture = async (userId) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const dates = await query(\n                    `SELECT date FROM registry_managements WHERE owner_id =${userId} and date > CURRENT_DATE AND completed_at is null GROUP BY date;`\n                );\n                resolve(dates);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    getRegistriesByDate = (date, owner_id) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const registries =\n                    await query(`select registry_managements.id , registry_managements.license_plate, registry_managements.address as registration_for, registry_managements.is_pay as status , vehicle_categories.name as type,car_images.url as display_image,\n                o.cost, date(registry_managements.date ) as date , date(p.completed_at) as completed_at\n                from registry_managements \n                inner join vehicle_types on registry_managements.vehicle_type_id= vehicle_types.id and registry_managements.owner_id=${owner_id} AND registry_managements.completed_at IS null AND registry_managements.date = '${date}'\n                inner join vehicle_categories on vehicle_categories.id=vehicle_types.vehicle_category_id\n                inner join cars ON cars.license_plates = registry_managements.license_plate \n                inner join car_images ON car_images.car_id =cars.id\n                LEFT join (SELECT * FROM registry_managements WHERE registry_managements.completed_at IS NOT NULL ORDER BY registry_managements.completed_at DESC limit 1) as p on p.license_plate = cars.license_plates\n                inner join (select bills.registry_id, sum(bills.fee) as cost from bills  group by registry_id )as o on o.registry_id=registry_managements.id and o.registry_id=registry_managements.id GROUP BY registry_managements.id\n                order by registry_managements.date desc;`);\n                resolve(registries);\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n}\n\nconst registryService = new RegistryService();\nmodule.exports = registryService;\n\n\n//# sourceURL=webpack://backend/./src/services/registry.service.js?");

/***/ }),

/***/ "./src/services/user.service.js":
/*!**************************************!*\
  !*** ./src/services/user.service.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const httpStatus = __webpack_require__(/*! http-status */ \"http-status\");\nconst connection = __webpack_require__(/*! ../model/connection.model */ \"./src/model/connection.model.js\");\nconst query = __webpack_require__(/*! ../model/query.model */ \"./src/model/query.model.js\");\nconst ApiError = __webpack_require__(/*! ../utils/ApiError */ \"./src/utils/ApiError.js\");\nconst crypt = __webpack_require__(/*! ./crypt.service */ \"./src/services/crypt.service.js\");\n\nclass UserService {\n    checkEmailAndPhone = async (email, phone) => {\n        try {\n            const result = await connection.query(\n                `SELECT * FROM users WHERE email = '${email}' AND phone = '${phone}'`\n            );\n            console.log(result);\n        } catch (error) {\n            console.log(error);\n        }\n    };\n    createUser = (user) => {};\n\n    getUserByPhone = ({ phone }) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const user = await query(\n                    `SELECT users.* , roles.name as role_name FROM users  Inner join roles on role_id = roles.id and phone = '${phone}' and isVerify !=0`\n                );\n                if (user.length === 0) {\n                    reject(new Error(\"Tài khoản không tồn tại.\"));\n                }\n                resolve(user[0]);\n            } catch (err) {\n                reject(err);\n            }\n        });\n    };\n\n    checkPassword = (hashPassword, password) => {\n        return new Promise((resolve, reject) => {\n            const decode = crypt.decode(hashPassword, password);\n            if (decode) resolve();\n            reject(new Error(\"Mật khẩu hoặc điện thoại không đúng.\"));\n        });\n    };\n\n    addDeviceToken = async (userId, deviceToken) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                const token = await query(\n                    `SELECT count(*) as count from device_tokens where user_id = ${userId} and token =  '${deviceToken}'`\n                );\n                if (token[0].count === 0) {\n                    await query(\n                        `INSERT INTO device_tokens (user_id , token) VALUES (${userId}, '${deviceToken}') `\n                    );\n                }\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n\n    deleteToken = (userId, deviceToken) => {\n        return new Promise(async (resolve, reject) => {\n            try {\n                await query(\n                    `DELETE from device_tokens where user_id = ${userId} and token ='${deviceToken}' `\n                );\n                resolve();\n            } catch (error) {\n                reject(error);\n            }\n        });\n    };\n}\n\nconst userService = new UserService();\nmodule.exports = userService;\n\n\n//# sourceURL=webpack://backend/./src/services/user.service.js?");

/***/ }),

/***/ "./src/utils/ApiError.js":
/*!*******************************!*\
  !*** ./src/utils/ApiError.js ***!
  \*******************************/
/***/ ((module) => {

eval("class ApiError extends Error {\n    constructor(statusCode, message, isOperational = true) {\n        super(message);\n        this.statusCode = statusCode;\n        this.isOperational = isOperational;\n    }\n}\n\nmodule.exports = ApiError;\n\n\n//# sourceURL=webpack://backend/./src/utils/ApiError.js?");

/***/ }),

/***/ "./src/utils/dateConvert.js":
/*!**********************************!*\
  !*** ./src/utils/dateConvert.js ***!
  \**********************************/
/***/ ((module) => {

eval("const dateConvert = (date) => {\n    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;\n};\n\nmodule.exports = dateConvert;\n\n\n//# sourceURL=webpack://backend/./src/utils/dateConvert.js?");

/***/ }),

/***/ "./src/utils/deleteFiles.js":
/*!**********************************!*\
  !*** ./src/utils/deleteFiles.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst deleteFiles = (files) => {\n    files.map((file) => {\n        const filePath = __basedir + \"/public/images/\" + file.filename;\n        if (fs.existsSync(filePath)) {\n            fs.unlinkSync(filePath);\n        }\n    });\n    return;\n};\n\nconst deleteImages = (images) => {\n    images.map((image) => {\n        const path = __basedir + \"/public/\" + image.url;\n        console.log(path);\n        if (fs.existsSync(path)) {\n            fs.unlinkSync(path);\n        }\n    });\n};\n\nmodule.exports = { deleteFiles, deleteImages };\n\n\n//# sourceURL=webpack://backend/./src/utils/deleteFiles.js?");

/***/ }),

/***/ "./src/utils/response.js":
/*!*******************************!*\
  !*** ./src/utils/response.js ***!
  \*******************************/
/***/ ((module) => {

eval("const response = (data, message, status) => {\n    return { status: status, data: data, message: message };\n};\n\nmodule.exports = response;\n\n\n//# sourceURL=webpack://backend/./src/utils/response.js?");

/***/ }),

/***/ "./src/utils/saveImage.js":
/*!********************************!*\
  !*** ./src/utils/saveImage.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const multer = __webpack_require__(/*! multer */ \"multer\");\nconst util = __webpack_require__(/*! util */ \"util\");\nconst { v4: uuidv4 } = __webpack_require__(/*! uuid */ \"uuid\");\nconst maxSize = 2 * 1024 * 1024;\n\nlet storage = multer.diskStorage({\n    destination: (req, file, cb) => {\n        cb(null, __basedir + \"/public/images\");\n    },\n    filename: (req, file, cb) => {\n        cb(null, uuidv4() + \"-\" + Date.now() + \".\" + file.mimetype.split(\"/\")[1]);\n    },\n});\n\nlet uploadFile = multer({\n    storage: storage,\n    fileFilter: (req, file, cb) => {\n        if (\n            file.mimetype == \"image/png\" ||\n            file.mimetype == \"image/jpg\" ||\n            file.mimetype == \"image/jpeg\"\n        ) {\n            cb(null, true);\n        } else {\n            cb(null, false);\n            return cb(new Error(\"Chỉ nhận định dạng .jpg , jpeg hoặc png\"));\n        }\n    },\n    limits: { fileSize: maxSize },\n}).array(\"photos\", 20);\n\nlet uploadFileMiddleware = util.promisify(uploadFile);\n\nmodule.exports = uploadFileMiddleware;\n\n\n//# sourceURL=webpack://backend/./src/utils/saveImage.js?");

/***/ }),

/***/ "./src/validations/auth.validation.js":
/*!********************************************!*\
  !*** ./src/validations/auth.validation.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Joi = __webpack_require__(/*! joi */ \"joi\");\n\nconst registerSchema = Joi.object({\n    name: Joi.string().trim().required(),\n    phone: Joi.string()\n        .trim()\n        .required()\n        .pattern(/^(\\+84|84|0){1}([3|5|7|8|9]){1}([0-9]{8})$/),\n    email: Joi.string().email().trim().required(),\n    password: Joi.string().trim().min(8).required(),\n});\nconst loginSchema = Joi.object({\n    phone_number: Joi.string().trim().required(),\n    password: Joi.string().trim().required(),\n    deviceToken: Joi.string().trim(),\n});\n\nconst logoutSchema = Joi.object({\n    deviceToken: Joi.string().trim(),\n});\nmodule.exports = { registerSchema, loginSchema, logoutSchema };\n\n\n//# sourceURL=webpack://backend/./src/validations/auth.validation.js?");

/***/ }),

/***/ "./src/validations/car.validate.js":
/*!*****************************************!*\
  !*** ./src/validations/car.validate.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Joi = __webpack_require__(/*! joi */ \"joi\");\n\nconst carSchema = Joi.object({\n    carId: Joi.number().required(),\n});\n\nconst licensePlateSchema = Joi.object({\n    licensePlate: Joi.string().trim().required(),\n});\n\nconst typeSchema = Joi.object({\n    categoryId: Joi.number().required(),\n});\n\nconst newCarSchema = Joi.object({\n    license_plate: Joi.string().trim().required(),\n    type: Joi.number().min(1).required(),\n    manufacture_at: Joi.number().min(1990).required(),\n});\nmodule.exports = { carSchema, typeSchema, newCarSchema, licensePlateSchema };\n\n\n//# sourceURL=webpack://backend/./src/validations/car.validate.js?");

/***/ }),

/***/ "./src/validations/registry.validation.js":
/*!************************************************!*\
  !*** ./src/validations/registry.validation.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Joi = __webpack_require__(/*! joi */ \"joi\");\n\nconst costCalculationSchema = Joi.object({\n    carId: Joi.number()\n        .required()\n        .min(0)\n        .error((errors) => {\n            errors.map((error) => {\n                switch (error.code) {\n                    case \"any.required\":\n                        error.message = \"Mã xe là bắt buộc.\";\n                        break;\n                    case \"number.min\":\n                        error.message = \"Mã xe không hợp lệ.\";\n                        break;\n                }\n            });\n            return errors;\n        }),\n    address: Joi.string().trim(),\n});\n\nconst dateSchema = Joi.object({\n    date: Joi.date()\n        .required()\n        .error((errors) => {\n            console.log(errors);\n            errors.map((error) => {\n                switch (error.code) {\n                    case \"date.base\":\n                        error.message = \"Ngày không hợp lệ.\";\n                        break;\n                    case \"any.required\":\n                        error.message = \"Ngày là bắt buộc.\";\n                        break;\n                }\n            });\n            return errors;\n        }),\n});\n\nconst registrationSchema = Joi.object({\n    carId: Joi.number().required(),\n    license_plates: Joi.string().min(8).trim().required(),\n    address: Joi.string().trim(),\n    date: Joi.date().min(Date.now()).required(),\n    feeTime: Joi.number().min(1).integer().required(),\n});\n\nmodule.exports = { costCalculationSchema, registrationSchema, dateSchema };\n\n\n//# sourceURL=webpack://backend/./src/validations/registry.validation.js?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "bcrypt/promises":
/*!**********************************!*\
  !*** external "bcrypt/promises" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt/promises");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "expo-server-sdk":
/*!**********************************!*\
  !*** external "expo-server-sdk" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("expo-server-sdk");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("helmet");

/***/ }),

/***/ "http-status":
/*!******************************!*\
  !*** external "http-status" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("http-status");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("joi");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("morgan");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("multer");

/***/ }),

/***/ "mysql2":
/*!*************************!*\
  !*** external "mysql2" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql2");

/***/ }),

/***/ "node-cron":
/*!****************************!*\
  !*** external "node-cron" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node-cron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "request_trimmer":
/*!**********************************!*\
  !*** external "request_trimmer" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("request_trimmer");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;