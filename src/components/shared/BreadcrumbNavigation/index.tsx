"use client"

import { Icon } from "@iconify/react"
import { motion } from "framer-motion"

const BreadcrumbNavigation = () => {
  const breadcrumbItems = [
    { label: "Home", href: "#", isActive: false },
    { label: "Courses", href: "#", isActive: false },
    { label: "Course Details", href: "#", isActive: true },
  ]

  return (
    <motion.div
      className="mb-4 text-sm text-gray-500 px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
          {breadcrumbItems.map((item, index) => (
            <motion.li
              key={item.label}
              className={index > 0 ? "flex items-center" : "inline-flex items-center"}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {index > 0 && (
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 - 0.05 }}
                >
                  <Icon icon="icon-park-outline:right" className="h-4 w-4 mx-2 text-gray-400" />
                </motion.div>
              )}

              {item.isActive ? (
                <motion.span className="text-gray-700 font-semibold" whileHover={{ scale: 1.05 }}>
                  {item.label}
                </motion.span>
              ) : (
                <motion.a
                  href={item.href}
                  className="hover:text-gray-900"
                  whileHover={{ scale: 1.05, color: "#1f2937" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.a>
              )}
            </motion.li>
          ))}
        </ol>
      </nav>
    </motion.div>
  )
}

export default BreadcrumbNavigation
