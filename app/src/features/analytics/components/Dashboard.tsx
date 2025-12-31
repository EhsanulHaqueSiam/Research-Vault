/**
 * Dashboard Component
 * 
 * Main analytics dashboard with summary cards and visualizations
 */

import { useQuery } from '@tanstack/react-query'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import {
    FolderOpen,
    CheckSquare,
    FileText,
    TrendingUp,
    AlertCircle,
    Clock,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { AnalyticsService } from '../services'
import { CalendarHeatmap } from './CalendarHeatmap'
import { MilestoneTracker, type Milestone } from './MilestoneTracker'
import { Greeting } from '@/components/layout/Greeting'
import { QuickActionsBar } from '@/components/layout/QuickActionsBar'
import { SkeletonCard } from '@/shared/components/LoadingStates'

// ============================================
// Summary Card Component
// ============================================

interface SummaryCardProps {
    title: string
    value: number | string
    subtitle?: string
    icon: React.ReactNode
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

function SummaryCard({ title, value, subtitle, icon, color }: SummaryCardProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={cn('p-3 rounded-lg', colorClasses[color])}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

// ============================================
// Chart Colors
// ============================================

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// ============================================
// Dashboard Component
// ============================================

export function Dashboard() {
    // Fetch dashboard stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => AnalyticsService.getDashboardStats(),
    })

    // Fetch activity data
    const { data: activityData } = useQuery({
        queryKey: ['dashboard', 'activity'],
        queryFn: () => AnalyticsService.getActivityData(7),
    })

    // Fetch task completion by project
    const { data: taskCompletionData } = useQuery({
        queryKey: ['dashboard', 'taskCompletion'],
        queryFn: () => AnalyticsService.getTaskCompletionByProject(5),
    })

    if (statsLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        )
    }

    // Pie chart data for task status
    const taskStatusData = stats ? [
        { name: 'Completed', value: stats.completedTasks },
        { name: 'Pending', value: stats.pendingTasks },
        { name: 'Overdue', value: stats.overdueTasks },
    ] : []

    return (
        <div className="space-y-6 p-6">
            {/* Personalized Greeting */}
            <Greeting subtitle="Here's an overview of your research progress" />

            {/* Quick Actions */}
            <QuickActionsBar
                onNewProject={() => console.log('New project')}
                onQuickNote={() => console.log('Quick note')}
                onResumeLast={() => console.log('Resume last')}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Projects"
                    value={stats?.totalProjects ?? 0}
                    subtitle={`${stats?.activeProjects ?? 0} active`}
                    icon={<FolderOpen size={20} />}
                    color="blue"
                />
                <SummaryCard
                    title="Total Tasks"
                    value={stats?.totalTasks ?? 0}
                    subtitle={`${stats?.taskCompletionRate ?? 0}% completed`}
                    icon={<CheckSquare size={20} />}
                    color="green"
                />
                <SummaryCard
                    title="Total Notes"
                    value={stats?.totalNotes ?? 0}
                    subtitle={`${stats?.recentNotes ?? 0} this week`}
                    icon={<FileText size={20} />}
                    color="purple"
                />
                <SummaryCard
                    title="Overdue Tasks"
                    value={stats?.overdueTasks ?? 0}
                    subtitle="Need attention"
                    icon={<AlertCircle size={20} />}
                    color={stats?.overdueTasks ? 'red' : 'green'}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" />
                        Weekly Activity
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="notes" stroke="#8b5cf6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Status Pie Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-green-500" />
                        Task Status
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                >
                                    {taskStatusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Completion by Project */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FolderOpen size={18} className="text-purple-500" />
                        Task Completion by Project
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taskCompletionData || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="completed" stackId="a" fill="#10b981" />
                                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500" />
                        Activity Heatmap
                    </h3>
                    <div className="overflow-x-auto">
                        <CalendarHeatmap
                            data={activityData?.map(d => ({ date: d.date, count: d.tasks + d.notes })) || []}
                            onDayClick={(date, count) => console.log(`${date}: ${count} activities`)}
                        />
                    </div>
                </div>

                {/* Milestones Tracker */}
                <div className="lg:col-span-1">
                    <MilestoneTracker
                        milestones={[
                            { id: '1', title: 'Literature Review', status: 'completed', dueDate: new Date('2024-12-15'), completedAt: new Date('2024-12-14') },
                            { id: '2', title: 'Data Collection', status: 'in-progress', dueDate: new Date('2025-01-15') },
                            { id: '3', title: 'Analysis Phase', status: 'pending', dueDate: new Date('2025-02-01') },
                            { id: '4', title: 'Draft Submission', status: 'pending', dueDate: new Date('2025-03-01') },
                        ] as Milestone[]}
                        onMilestoneClick={(m) => console.log('Clicked milestone:', m.title)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
