import { useEffect, useState } from "react"
import { Package, Search, Truck, CheckCircle2, Clock, Star, Filter, XCircle } from "lucide-react"
import { toast } from "sonner"
import { districtService, Orders } from "./service/districtService"
import PageHeader from "@/components/shared/page-header"
import { generateDistrictReport } from "@/utils/export-utils"
import { Eye, Download, CreditCard, XCircle as CancelIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function DistrictDeliveries() {
    const [loading, setLoading] = useState(true)
    const [deliveries, setDeliveries] = useState<Orders[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [paymentFilter, setPaymentFilter] = useState<string>("ALL")
    const [schoolFilter, setSchoolFilter] = useState<string>("ALL")
    const [supplierFilter, setSupplierFilter] = useState<string>("ALL")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [selectedDelivery, setSelectedDelivery] = useState<Orders | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [items, setItems] = useState<any[]>([])

    useEffect(() => {
        fetchDeliveries()
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const data = await districtService.getAllItems()
            setItems(data || [])
        } catch (error) {
            console.error("Error fetching items:", error)
        }
    }

    const fetchDeliveries = async () => {
        try {
            setLoading(true)
            const districtId = localStorage.getItem("districtId")
            if (!districtId) {
                toast.error("District ID not found. Please login again.")
                return
            }

            const data = await districtService.getDistrictDeliveries(districtId)
            setDeliveries(data || [])
        } catch (error) {
            console.error("Error fetching deliveries:", error)
            toast.error("Failed to load deliveries.")
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "DELIVERED":
                return (
                    <Badge className="bg-green-600 hover:bg-green-700">
                        Delivered
                    </Badge>
                )
            case "PROCESSING":
                return (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Processing
                    </Badge>
                )
            case "APPROVED":
                return (
                    <Badge className="bg-green-600 hover:bg-green-700">
                        Approved
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline">
                        {status}
                    </Badge>
                )
        }
    }

    const getPaymentBadge = (state: string) => {
        switch (state.toUpperCase()) {
            case "PAID":
                return (
                    <Badge className="bg-green-600 hover:bg-green-700">
                        Paid
                    </Badge>
                )
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Pending
                    </Badge>
                )
            default:
                return <Badge variant="outline">{state}</Badge>
        }
    }

    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                            }`}
                    />
                ))}
            </div>
        )
    }

    const handleExport = async () => {
        try {
            const exportData = filteredDeliveries.map(d => ({
                School: d.requestItem?.school?.name || "N/A",
                Supplier: d.supplier?.names || "N/A",
                Items: d.requestItem?.requestItemDetails?.map(detail => `${getItemName(detail)} (${detail.quantity}${detail.item?.unit || ''})`).join(", ") || "N/A",
                Date: d.deliveryDate ? new Date(d.deliveryDate).toLocaleDateString() : "TBD",
                Price: `${d.orderPrice?.toLocaleString()} RWF`,
                Status: d.deliveryStatus,
                Payment: d.orderPayState,
                Rating: d.rating
            }))

            await generateDistrictReport(
                "Delivery History",
                { from: undefined, to: undefined },
                "pdf",
                exportData
            )
            toast.success("Report generated successfully")
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Failed to generate report")
        }
    }

    const handlePayment = async (orderId: string) => {
        try {
            setActionLoading(true)
            await districtService.payOrder(orderId)
            toast.success("Order payment processed successfully")
            fetchDeliveries()
            setDetailsOpen(false)
        } catch (error: any) {
            toast.error(error.response?.data || "Failed to process payment")
        } finally {
            setActionLoading(false)
        }
    }

    const handleCancelPayment = async (orderId: string) => {
        try {
            setActionLoading(true)
            await districtService.cancelOrderPayment(orderId)
            toast.success("Order payment cancelled successfully")
            fetchDeliveries()
            setDetailsOpen(false)
        } catch (error: any) {
            toast.error(error.response?.data || "Failed to cancel payment")
        } finally {
            setActionLoading(false)
        }
    }

    const filteredDeliveries = deliveries.filter((d) => {
        const matchesSearch =
            d.requestItem?.school?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.supplier?.names.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.supplier?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || d.deliveryStatus.toUpperCase() === statusFilter
        const matchesPayment = paymentFilter === "ALL" || d.orderPayState.toUpperCase() === paymentFilter
        const matchesSchool = schoolFilter === "ALL" || d.requestItem?.school?.id === schoolFilter
        const matchesSupplier = supplierFilter === "ALL" || d.supplier?.id === supplierFilter

        return matchesSearch && matchesStatus && matchesPayment && matchesSchool && matchesSupplier
    })

    const uniqueSchools = Array.from(new Set(deliveries.map(d => d.requestItem?.school).filter(Boolean))).filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
    const uniqueSuppliers = Array.from(new Set(deliveries.map(d => d.supplier).filter(Boolean))).filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)

    useEffect(() => {
        setPage(1)
    }, [searchQuery, statusFilter, paymentFilter, schoolFilter, supplierFilter])

    const totalPages = Math.max(1, Math.ceil(filteredDeliveries.length / pageSize))
    const startIndex = (page - 1) * pageSize
    const paginatedDeliveries = filteredDeliveries.slice(startIndex, startIndex + pageSize)

    const canPrev = page > 1
    const canNext = page < totalPages

    const getPageWindow = () => {
        const maxButtons = 5
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const half = Math.floor(maxButtons / 2)
        let start = Math.max(1, page - half)
        let end = Math.min(totalPages, start + maxButtons - 1)
        if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const getItemName = (detail: any) => {
        if (detail.item?.name) return detail.item.name
        if (detail.name) return detail.name
        const found = items.find(i => i.id === detail.item?.id || i.id === detail.id)
        return found?.name || detail.item?.name || (detail as any).name || "Item"
    }

    return (
        <div className="flex-1">
            <PageHeader
                title="Deliveries Management"
                homeTo="/district-dashboard"
                HomeIcon={Truck}
                profileTo="/district-profile"
                userName="District Coordinator"
                userEmail="coordinator@district.rw"
                avatarSrc="/userIcon.png"
                avatarFallback="DC"
            />

            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : deliveries.length}</div>
                            <p className="text-xs text-muted-foreground">Across all schools</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? "..." : deliveries.filter(d => d.deliveryStatus === "DELIVERED").length}
                            </div>
                            <p className="text-xs text-muted-foreground">Successful deliveries</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? "..." : deliveries.filter(d => ["PROCESSING", "APPROVED"].includes(d.deliveryStatus)).length}
                            </div>
                            <p className="text-xs text-muted-foreground">Current operations</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold font-mono">
                                {loading ? "..." : `${deliveries.reduce((acc, d) => acc + d.orderPrice, 0).toLocaleString()} RWF`}
                            </div>
                            <p className="text-xs text-muted-foreground">Cumulative worth</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-md">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <CardTitle className="text-xl font-bold">Delivery History</CardTitle>
                                <CardDescription>Monitor all food deliveries across the district</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 w-full md:w-auto font-medium"
                                onClick={handleExport}
                            >
                                <Download className="h-4 w-4" />
                                Export Reports
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-muted/30 p-4 rounded-xl border">
                            <div className="lg:col-span-4 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Search Delivery</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search schools or suppliers..."
                                        className="pl-9 bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-8 flex flex-wrap lg:flex-nowrap items-end gap-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Dist. Status</label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-full bg-background border-muted-foreground/20">
                                                <SelectValue placeholder="Delivery" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Status</SelectItem>
                                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                                <SelectItem value="APPROVED">Approved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Pay Status</label>
                                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                            <SelectTrigger className="w-full bg-background border-muted-foreground/20">
                                                <SelectValue placeholder="Payment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Payment</SelectItem>
                                                <SelectItem value="PAID">Paid</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">School</label>
                                        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                                            <SelectTrigger className="w-full bg-background border-muted-foreground/20">
                                                <SelectValue placeholder="School" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Schools</SelectItem>
                                                {uniqueSchools.map(school => (
                                                    <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Supplier</label>
                                        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                                            <SelectTrigger className="w-full bg-background border-muted-foreground/20">
                                                <SelectValue placeholder="Supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Suppliers</SelectItem>
                                                {uniqueSuppliers.map(supplier => (
                                                    <SelectItem key={supplier.id} value={supplier.id}>{supplier.names}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {(statusFilter !== "ALL" || paymentFilter !== "ALL" || schoolFilter !== "ALL" || supplierFilter !== "ALL" || searchQuery !== "") && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setStatusFilter("ALL");
                                            setPaymentFilter("ALL");
                                            setSchoolFilter("ALL");
                                            setSupplierFilter("ALL");
                                            setSearchQuery("");
                                        }}
                                        className="h-10 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School</TableHead>
                                        <TableHead>Supplier</TableHead> 
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell> 
                                                <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredDeliveries.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="h-10 w-10 opacity-20" />
                                                    <p>No deliveries found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedDeliveries.map((delivery) => (
                                            <TableRow key={delivery.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">
                                                    {delivery.requestItem?.school?.name || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{delivery.supplier?.names}</span>
                                                        <span className="text-xs text-muted-foreground">{delivery.supplier?.companyName}</span>
                                                    </div>
                                                </TableCell> 
                                                <TableCell className="text-right font-mono">
                                                    {delivery.orderPrice?.toLocaleString()} RWF
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(delivery.deliveryStatus)}
                                                </TableCell>
                                                <TableCell>
                                                    {getPaymentBadge(delivery.orderPayState)}
                                                </TableCell>
                                                <TableCell>
                                                    {renderRating(delivery.rating)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2 text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedDelivery(delivery)
                                                                setDetailsOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {delivery.orderPayState === "PENDING" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={() => handlePayment(delivery.id)}
                                                                disabled={actionLoading}
                                                                title="Mark as Paid"
                                                            >
                                                                <CreditCard className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Delivery Details Dialog */}
                        {selectedDelivery && (
                            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Delivery Details</DialogTitle>
                                        <DialogDescription>
                                            Detailed information about delivery for {selectedDelivery.requestItem?.school?.name}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">School</p>
                                                <p className="text-sm font-semibold">{selectedDelivery.requestItem?.school?.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Supplier</p>
                                                <p className="text-sm font-semibold">{selectedDelivery.supplier?.names}</p>
                                                <p className="text-xs text-muted-foreground">{selectedDelivery.supplier?.companyName}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground uppercase">Requested Items</p>
                                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                                {selectedDelivery.requestItem?.requestItemDetails?.map((detail, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <span>{getItemName(detail)}</span>
                                                        <span className="font-mono font-medium">{detail.quantity} {detail.item?.unit || ""}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Delivery Status</p>
                                                <div>{getStatusBadge(selectedDelivery.deliveryStatus)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Payment Status</p>
                                                <div>{getPaymentBadge(selectedDelivery.orderPayState)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Order Price</p>
                                                <p className="text-sm font-mono font-bold text-primary">
                                                    {selectedDelivery.orderPrice?.toLocaleString()} RWF
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Delivery Date</p>
                                                <p className="text-sm">{selectedDelivery.deliveryDate ? new Date(selectedDelivery.deliveryDate).toLocaleDateString() : 'Pending'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Expected Date</p>
                                                <p className="text-sm">{new Date(selectedDelivery.expectedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {selectedDelivery.rating > 0 && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">School Rating</p>
                                                <div className="flex items-center gap-2">
                                                    {renderRating(selectedDelivery.rating)}
                                                    <span className="text-sm font-medium">({selectedDelivery.rating}/5)</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <div className="flex w-full justify-between items-center">
                                            <div className="flex gap-2">
                                                {selectedDelivery.orderPayState === "PENDING" && (
                                                    <Button
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                                        onClick={() => handlePayment(selectedDelivery.id)}
                                                        disabled={actionLoading}
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        Mark as Paid
                                                    </Button>
                                                )}
                                            </div>
                                            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-sm">
                                    Showing {filteredDeliveries.length === 0 ? 0 : startIndex + 1}–
                                    {Math.min(startIndex + pageSize, filteredDeliveries.length)} of {filteredDeliveries.length}
                                </span>
                                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                                    <SelectTrigger className="w-[110px]">
                                        <SelectValue placeholder="Rows" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={(e) => { e.preventDefault(); if (canPrev) setPage((p) => p - 1) }}
                                            className={!canPrev ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                            href="#"
                                        />
                                    </PaginationItem>

                                    {getPageWindow().map((p) => (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                href="#"
                                                isActive={p === page}
                                                onClick={(e) => { e.preventDefault(); setPage(p) }}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={(e) => { e.preventDefault(); if (canNext) setPage((p) => p + 1) }}
                                            className={!canNext ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                            href="#"
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
