"use client";

import { Icon } from "@iconify/react"
import { ModalProps } from "@/types/modal"
import Modal from "../modal"
import { motion } from "framer-motion"

interface LeaderboardModalProps extends ModalProps {
  props?: {
    courseName?: string;
    onClose?: () => void;
  }
}

const LeaderboardModal = ({ isOpen, onClose, isMobile, props }: LeaderboardModalProps) => {
  const userRank = 3

  if (!isOpen) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isMobile={isMobile}
      title="Leaderboard"
      size="md"
    >
      
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 shadow-sm border border-indigo-100 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
          <Icon icon="mdi:trophy-variant" className="w-full h-full text-indigo-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">{props?.courseName || "Course Name Shown Here"}</h3>
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center">
            <Icon icon="mdi:star-circle" className="text-yellow-500 mr-2 text-xl" />
            <span className="text-indigo-900 font-medium">Excellent work! Your performance is outstanding.</span>
          </div>
          
          <div className="flex items-center">
            <Icon icon="mdi:medal" className="text-indigo-500 mr-2 text-xl" />
            <span className="text-indigo-900">Better than <span className="font-bold">80%</span> of other students</span>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-indigo-900">Your progress rank</span>
              <span className="font-bold text-indigo-600">#{userRank}</span>
            </div>
            
            <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${(100 - (userRank-1) * 15)}%` }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div 
            key={i}
            className={`border rounded-lg p-3 shadow-sm transition-all ${i === userRank ? 'bg-blue-50 border-blue-200' : 'border-gray-100 hover:border-gray-200'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                  i === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                  i === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  i === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                  'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}>
                  {i === 1 && <Icon icon="mdi:crown" className="text-xl" />}
                  {i !== 1 && `#${i}`}
                </div>
                {i === userRank && (
                  <div className="absolute -right-1 -top-1 bg-blue-500 rounded-full w-4 h-4 border border-white">
                    <Icon icon="mdi:user" className="w-full h-full text-white" />
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900">
                    {i === userRank ? 'You' : `Student ${i}`}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">{100 - (i-1) * 5}%</p>
                </div>
                
                <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      i === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                      i === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                      i === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${100 - (i-1) * 5}%` }}
                  />
                </div>
                
                <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    <Icon icon="mdi:clock-outline" className="inline mr-1" />
                    {10 - i} hrs
                  </span>
                  <span>
                    <Icon icon="mdi:check-circle" className="inline mr-1 text-green-500" />
                    {20 - i * 2} tasks
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Modal>
  )
}

export default LeaderboardModal 