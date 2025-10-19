import { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  PlayCircle, 
  Download, 
  Settings, 
  ChevronRight,
  Layers,
  History,
  HelpCircle,
  FileInputIcon,
  BookA,
  Menu
} from 'lucide-react';
import { SubmitButton } from './submit';
import { PipelineToolbar } from './toolbar';

export function Navbar({ onTabChange }) {
const [activeNodes, setActiveNodes] = useState(['input', 'output', 'text', 'note','comment']);
  const [activeTab, setActiveTab] = useState('Start');

  const tabs = [
    { id: 'Start', label: 'Start', icon: Layers,nodes:['input','output','text','note','comment'] },
    { id: 'Objects', label: 'Objects', icon: null,nodes:[] },
    { id: 'Knowledge', label: 'Knowledge', icon: null,nodes:[] },
    { id: 'AI', label: 'AI', icon: null,nodes:['llm'] },
    { id: 'Integrations', label: 'Integrations', icon: null,nodes:[] },
    { id: 'Logic', label: 'Logic', icon: null,nodes:[] },
    { id: 'Data', label: 'Data', icon: null,nodes:[] },
    { id: 'Chat', label: 'Chat', icon: null,nodes:[] },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab.id);
    setActiveNodes(tab.nodes);
    onTabChange(tab.nodes);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b  border-stone-200/50 bg-gradient-to-r from-white via-stone-50 to-white backdrop-blur-xl shadow-sm ">
      <div className="flex items-center justify-between bg-gray-800 px-6 py-3 ">
        {/* Left Section - Breadcrumb */}
        <div className="flex items-center gap-3 ">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <button className="text-stone-100 hover:text-stone-900 transition-colors duration-200 hover:scale-105 transform">
              Workbooks
            </button>
            <ChevronRight className="w-4 h-4 text-stone-400" />
            <button className="text-stone-100 hover:text-stone-900 transition-colors duration-200 hover:scale-105 transform">
              Untitled Workbook
            </button>
            <ChevronRight className="w-4 h-4 text-stone-400" />
            <span className="text-stone-300 font-semibold">
              Copy of Blog Article Generator Tem...
            </span>
          </div>
          
          <button className="ml-2 text-stone-500 bg-slate-300  hover:text-stone-700 transition-colors p-1 rounded-md hover:bg-stone-100">
            <Settings className="w-4 h-4 hover:animate-spin " />
          </button>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-3">
          
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-100 hover:text-stone-900 hover:bg-stone-100/80 transition-all duration-200"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-100 hover:text-stone-900 hover:bg-stone-100/80 transition-all duration-200"
          >
            <History className="w-4 h-4" />
            View Traces
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-100 hover:text-stone-900 hover:bg-stone-100/80 transition-all duration-200"
          >
            <History className="w-4 h-4" />
            Version History
          </Button>

          <Separator orientation="vertical" className="h-6 bg-stone-300" />

          <SubmitButton/>

          <Button
            variant="run"
            size="sm"
          >
            <PlayCircle/>
            Run
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <button className="ml-2 text-stone-300 hover:text-stone-700 transition-colors p-2 rounded-md hover:bg-stone-100">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-t border-stone-200/50 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-start justify-start px-6">
          <div className="flex items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab)}
                  className={`
                    relative px-4 py-3 text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-blue-600' 
                      : 'text-stone-600 hover:text-stone-900'
                    }
                    hover:bg-stone-50/80
                    flex items-center gap-2
                    group
                  `}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {tab.label}
                  
                  {/* Active indicator with gradient */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse" />
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              );
            })}
          </div>
          
          {/* Embedded Pipeline Toolbar */}
          <div className="py-2">
            <PipelineToolbar activeNodes={activeNodes} />
          </div>
        </div>
      </div>
    </nav>
  );
}
