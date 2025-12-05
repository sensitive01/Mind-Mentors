const OperationDept = require("../../../model/operationDeptModel");

// ===============================
// ✅ GLOBAL SEARCH CONTROLLER
// ===============================
exports.globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        console.log("searching", q);

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const searchText = q.trim();

        // -------------------------------
        // ✅ Helper: Normalize Numbers
        // -------------------------------
        const normalizePhone = (num) => num.replace(/\D/g, "");

        const isNumber = !isNaN(searchText);
        let numberVariations = [];

        if (isNumber) {
            const num = normalizePhone(searchText);

            numberVariations = [
                num,               // 7559889322
                "91" + num,        // 917559889322
                "+91" + num        // +917559889322
            ];
        }

        // --------------------------------
        // ✅ Mongo Search Filter
        // --------------------------------
        const filter = {
            $or: [
                { parentFirstName: { $regex: searchText, $options: "i" } },
                { parentLastName: { $regex: searchText, $options: "i" } },
                { kidFirstName: { $regex: searchText, $options: "i" } },
                { kidLastName: { $regex: searchText, $options: "i" } },
                { email: { $regex: searchText, $options: "i" } },
                { enquiryStatus: { $regex: searchText, $options: "i" } },
                { enquiryField: { $regex: searchText, $options: "i" } },
            ]
        };

        // --------------------------------
        // ✅ Add Smart Phone Search
        // --------------------------------
        if (isNumber) {
            filter.$or.push(
                // exact matches
                { whatsappNumber: { $in: numberVariations } },
                { contactNumber: { $in: numberVariations } },

                // regex fallback (partial match)
                { whatsappNumber: { $regex: numberVariations[0] } },
                { contactNumber: { $regex: numberVariations[0] } }
            );
        }

        // --------------------------------
        // ✅ MongoDB ObjectId Search
        // --------------------------------
        if (searchText.match(/^[0-9a-fA-F]{24}$/)) {
            filter.$or.push({ _id: searchText });
        }

        // --------------------------------
        // ✅ QUERY DB
        // --------------------------------
        const results = await OperationDept
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // --------------------------------
        // ✅ FORMAT DATES
        // --------------------------------
        const formatDate = (date) => {
            if (!date) return "N/A";
            return new Date(date).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        };

        const formattedResults = results.map((item) => ({
            ...item,
            formattedCreatedAt: formatDate(item.createdAt),
            formattedUpdatedAt: formatDate(item.updatedAt),
            parentName: `${item.parentFirstName || ""} ${item.parentLastName || ""}`.trim(),
            kidName: `${item.kidFirstName || ""} ${item.kidLastName || ""}`.trim(),
        }));

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            data: formattedResults,
        });

    } catch (error) {
        console.error("Global Search Error:", error);
        res.status(500).json({
            success: false,
            message: "Global search failed",
            error: error.message,
        });
    }
};
