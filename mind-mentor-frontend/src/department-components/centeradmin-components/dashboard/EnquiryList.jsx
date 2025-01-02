const demoData = [
    {
      rollNo: '101',
      photograph: 'https://randomuser.me/api/portraits/men/1.jpg',
      name: 'John Doe',
      age: 22,
      registeredDate: '2024-01-15',
      lastInteractionTime: '2024-11-10 14:30',
      lastInteractedWith: 'Jane Smith',
      leadSource: 'Facebook',
      programs: 'React Development',
      stageTag: 'Prospect',
      parentsEmail: 'johndoe@parents.com',
      enrolledCentre: 'Main Centre',
      allottedCentre: 'North Branch',
      country: 'India',
      addNotes: 'Interested in full-stack courses.',
    },
    {
      rollNo: '102',
      photograph: 'https://randomuser.me/api/portraits/men/2.jpg',
      name: 'Sam Wilson',
      age: 25,
      registeredDate: '2024-02-10',
      lastInteractionTime: '2024-11-09 10:15',
      lastInteractedWith: 'John Doe',
      leadSource: 'Instagram',
      programs: 'Node.js Backend',
      stageTag: 'Interested',
      parentsEmail: 'samwilson@parents.com',
      enrolledCentre: 'East Centre',
      allottedCentre: 'South Branch',
      country: 'USA',
      addNotes: 'Looking for advanced level programs.',
    },
    {
      rollNo: '103',
      photograph: 'https://randomuser.me/api/portraits/women/1.jpg',
      name: 'Alice Johnson',
      age: 20,
      registeredDate: '2024-03-05',
      lastInteractionTime: '2024-11-08 16:00',
      lastInteractedWith: 'Sam Wilson',
      leadSource: 'Referral',
      programs: 'UI/UX Design',
      stageTag: 'Enrolled',
      parentsEmail: 'alicejohnson@parents.com',
      enrolledCentre: 'Central Centre',
      allottedCentre: 'West Branch',
      country: 'UK',
      addNotes: 'Enrolled for a short-term design program.',
    },
  ];
  
  const EnquiryList = () => {
    return (
      <div className="w-full overflow-x-auto">
<table className="min-w-full table-auto">
  <thead>
    <tr className="bg-[#642b8f] text-white">
      <th className="px-4 py-2 text-left">Roll No</th>
      <th className="px-4 py-2 text-left">Photograph</th>
      <th className="px-4 py-2 text-left">Name</th>
      <th className="px-4 py-2 text-left">Age</th>
      <th className="px-4 py-2 text-left">Registered Date</th>
      <th className="px-4 py-2 text-left">Last Interaction Time</th>
      <th className="px-4 py-2 text-left">Last Interacted with</th>
      <th className="px-4 py-2 text-left">Lead Source</th>
      <th className="px-4 py-2 text-left">Programs</th>
      <th className="px-4 py-2 text-left">Stage Tag</th>
      <th className="px-4 py-2 text-left">Parents Email</th>
      <th className="px-4 py-2 text-left">Enrolled Centre</th>
      <th className="px-4 py-2 text-left">Allotted Centre</th>
      <th className="px-4 py-2 text-left">Country</th>
      <th className="px-4 py-2 text-left">Add Notes</th>
    </tr>
  </thead>
  <tbody className="overflow-y-auto max-h-[300px]">
    {demoData.map((row, index) => (
      <tr
        key={index}
        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
      >
        <td className="px-4 py-2 border">{row.rollNo}</td>
        <td className="px-4 py-2 border">
          <img
            src={row.photograph}
            alt="Photograph"
            className="w-10 h-10 rounded-full"
          />
        </td>
        <td className="px-4 py-2 border">{row.name}</td>
        <td className="px-4 py-2 border">{row.age}</td>
        <td className="px-4 py-2 border">{row.registeredDate}</td>
        <td className="px-4 py-2 border">{row.lastInteractionTime}</td>
        <td className="px-4 py-2 border">{row.lastInteractedWith}</td>
        <td className="px-4 py-2 border">{row.leadSource}</td>
        <td className="px-4 py-2 border">{row.programs}</td>
        <td className="px-4 py-2 border">{row.stageTag}</td>
        <td className="px-4 py-2 border">{row.parentsEmail}</td>
        <td className="px-4 py-2 border">{row.enrolledCentre}</td>
        <td className="px-4 py-2 border">{row.allottedCentre}</td>
        <td className="px-4 py-2 border">{row.country}</td>
        <td className="px-4 py-2 border">{row.addNotes}</td>
      </tr>
    ))}
  </tbody>
</table>


      </div>
    );
  };
  export default EnquiryList;