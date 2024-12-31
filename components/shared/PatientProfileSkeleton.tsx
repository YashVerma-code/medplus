import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PatientProfileSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="health" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
              {['Health Info', 'Medications', 'Records', 'Payments'].map((tab) => (
                <TabsTrigger key={tab} value={tab.toLowerCase().replace(' ', '-')}>
                  <Skeleton className="h-4 w-20" />
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="health">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {['medications', 'records', 'payments'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

