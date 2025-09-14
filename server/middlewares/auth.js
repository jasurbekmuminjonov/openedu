const jwt = require("jsonwebtoken");
const Staff = require("../models/staff.model");
module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const adminPath = [
      "/organization/edit/password",
      "/staff/edit/password",
      "/organization/edit",
      "/staff/edit",
      "/organization/terminate",
      "/staff/create",
    ];
    const publicPath = [
      "/organization/create",
      "/organization/login",
      "/staff/login",
    ];
    if (publicPath.includes(req.path)) {
      return next();
    }

    const sections = [
      {
        section: "student",
        path: ["/student/create", "/student/edit"],
      },
      {
        section: "payment",
        path: ["/payment/create"],
      },
      {
        section: "salary",
        path: ["/salary/create", "/salary/delete"],
      },
      {
        section: "expense",
        path: [
          "/expense/create",
          "/expense/category/create",
          "/expense/delete",
          "/expense/category/delete",
        ],
      },
      {
        section: "group",
        path: ["/group/create", "/group/edit"],
      },
      {
        section: "subscription",
        path: ["/subscription/create", "/subscription/edit"],
      },
      {
        section: "subject",
        path: ["/subject/create"],
      },
      {
        section: "teacher",
        path: ["/teacher/create"],
      },
    ];

    if (!authHeader) {
      return res.status(401).json({ message: "auth_not_found" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token_not_found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.org_id || !decoded.role) {
      return res.status(401).json({ message: "token_invalid" });
    }
    if (decoded.role !== "admin") {
      if (adminPath.includes(req.path)) {
        return res.status(403).json({ message: "access_denied" });
      }

      const staff = await Staff.findById(decoded.user_id);
      const allowedSections = staff.sections;

      const sectionForPath = sections.find((sec) =>
        sec.path.includes(req.path)
      );

      if (sectionForPath) {
        if (!allowedSections.includes(sectionForPath.section)) {
          return res.status(403).json({ message: "access_denied" });
        }
      }
      // agar req.path sections array’ida yo‘q – ochiq yo‘l bo‘lib qoladi
    }

    // if (decoded.role !== "admin") {
    //   if (adminPath.includes(req.path)) {
    //     return res.status(403).json({ message: "access_denied" });
    //   }
    //   const staff = await Staff.findById(decoded.user_id);
    //   const allowedSections = staff.sections;
    //   const allowedPaths = sections
    //     .filter((sec) => allowedSections.includes(sec.section))
    //     .flatMap((sec) => sec.path);
    //   if (!allowedPaths.includes(req.path)) {
    //     return res.status(403).json({ message: "access_denied" });
    //   }
    // }
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "token_invalid", data: { error: err.message } });
  }
};
