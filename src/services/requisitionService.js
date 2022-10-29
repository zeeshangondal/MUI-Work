const KEYS = {
    requisitions: 'requisitions',
    requisitionId: 'requisitionId'
}

export const getDepartmentCollection = () => ([
    { id: '0', title: 'CS' },
    { id: '1', title: 'SE' },
    { id: '2', title: 'Cyber' },
    { id: '3', title: 'EE' },
    { id: '4', title: 'FSM' }
    
])

export function insertRequisition(data) {
    let requisitions= getAllRequisitions();
    data['id'] = generateRequisitionId()
    requisitions.push(data)
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions))
}

export function updateRequisition(data) {
    let requisitions = getAllRequisitions();
    let recordIndex = requisitions.findIndex(x => x.id == data.id);
    requisitions[recordIndex] = { ...data }
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions));
}

export function deleteRequisition(id) {
    let requisitions= getAllRequisitions();
    requisitions= requisitions.filter(x => x.id != id)
    localStorage.setItem(KEYS.requisitions, JSON.stringify(requisitions));
}

export function generateRequisitionId() {
    if (localStorage.getItem(KEYS.requisitionId) == null)
        localStorage.setItem(KEYS.employeeId, '0')
    var id = parseInt(localStorage.getItem(KEYS.requisitionId))
    localStorage.setItem(KEYS.requisitionId, (++id).toString())
    return id;
}

export function getAllRequisitions() {
    if (localStorage.getItem(KEYS.requisitions) == null)
        localStorage.setItem(KEYS.requisitions, JSON.stringify([]))
    let requisitionForms = JSON.parse(localStorage.getItem(KEYS.requisitions));
    //map departmentID to department title
    let departments = getDepartmentCollection();
    return requisitionForms.map(x => ({
        ...x,
        department: departments[x.departmentId].title
    }))
}
