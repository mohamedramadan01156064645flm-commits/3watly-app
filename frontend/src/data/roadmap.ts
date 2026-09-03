export type RoadmapWeek = {
  week: string;
  step: number;
  title: string;
  detail: string;
  hours: string;
  icon: string;
  tone: 'blue' | 'green';
};

export const roadmapWeeks: RoadmapWeek[] = [
{
  week: 'WEEK 1',
  step: 1,
  title: 'Python Fundamentals',
  detail: 'Variables, Data Types, Loops, Functions',
  hours: '6–8 hrs',
  icon: 'https://cdn.simpleicons.org/python',
  tone: 'blue'
},
{
  week: 'WEEK 2',
  step: 2,
  title: 'Data Analysis with Pandas',
  detail: 'DataFrames, Cleaning, Aggregation',
  hours: '8–10 hrs',
  icon: 'https://cdn.simpleicons.org/pandas/130654',
  tone: 'blue'
},
{
  week: 'WEEK 3',
  step: 3,
  title: 'Power BI Essentials',
  detail: 'Data Modeling, Dashboards, DAX',
  hours: '8–10 hrs',
  icon: 'https://cdn.simpleicons.org/powerbi',
  tone: 'blue'
},
{
  week: 'WEEK 4',
  step: 4,
  title: 'Docker Basics',
  detail: 'Containers, Images, Dockerfile',
  hours: '6–8 hrs',
  icon: 'https://cdn.simpleicons.org/docker',
  tone: 'green'
},
{
  week: 'WEEK 5',
  step: 5,
  title: 'Advanced SQL & Optimization',
  detail: 'Joins, Windows, Query Tuning',
  hours: '6–8 hrs',
  icon: 'https://cdn.simpleicons.org/postgresql/1F2937',
  tone: 'green'
},
{
  week: 'WEEK 6',
  step: 6,
  title: 'Capstone Project',
  detail: 'End-to-End Analytics Project',
  hours: '10–12 hrs',
  icon: 'https://cdn.simpleicons.org/apachesuperset/1F2937',
  tone: 'green'
}];