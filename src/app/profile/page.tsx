import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const bookCovers = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAAkuAtoD58QZrfW0bj38-Iof_illoOpI50Cect-tZmn4-1ckK5WudRc73J5UCL-SgwlBC77_zYZjP_p9gCR2ngezaa_D4izW_6stWzWMkljnSpTwovAZm08QhmYkOwSnuJS9KsBUBoAOT7cmF8ZpKH8q6Ig-6rzKyO5maSfJ-lhHO5nVX9ChdO6XU1vwFRfgXDYnCOsjB6bTQSk9hE47EIJIfFFUiWwn4F04vNc7OE4QyFxaB8u4J69sEgVr5AgA0LhS0AgnuwtzA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDrihY5B6_I2cLjyV_XlAAxMimGrkdTT6QP1TCyqrGOzQ9jnkpar9-3zvyl7XjTF4qijNRw2lPGfLPG4zH3-8vI7njK6lqCADlAJu2HRvHuEOs6VsRgzi1wmiLWnsVCOfbRaLcXEewQdafqsAMr0BmlgVvcAjrcrEhR37bVpO44GZen1dyyRnhpfc6lhVn9vD5Kt-wFI1zsdrvBkPTV-t0UMV2nz-bKCEViIPP0m4PNaHQmpSy1KNrbK7-iO2VAcyGQIY9L4b9vxmc",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAO7mOOdNbQUbLeKPMGzWb1u9WTzYlw01OWRJ6AMvRJh6Jf5-5od1tplSMUzkr1WZE9rxa4rtnTkAHRRwv1TFNWzYFZZTXCtmIM5FLusrsaI1vzavJcXgw_75VjUs2tXhYyxEhFdw8HOfERra4meZcHRpY_SC7bSpkG_29xANwNAZcuQbUEj0GV1BKeleloodfsYaSE9QXPpmTJtJhIr5wtTn-4C8jnS9ElObpkK18Vp8w2vHBpIJijou3bIWA2Q547sjea2Cm9PAI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDkWjKnzCcSp4rK-KwJTHHLSv92ur0qRwLei3ACE7KF7bCDm1afT4I73njQaTlJaBphVKdykWOOCCrJyGuS0MSQ9brEfEKRLe0AoNiUoT4qm1OWUOhN-hL2Lf1_IIS5OGENAoI2JCaBz0QCUw-UHCe4ZhHlwhmPUi2PFcm8MWtZkTdlYThDGOrekdkNXalnTilKDPVRkjyTNuhcNHX8QxckcgQLPA9RDq_WACi7xqQGcY3bQuWy5p9xaOBDtmf6ipF5qX2NoKCi4vE",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDa-eZrIdffR2soSh4XQz3GseFLMdyIJFwvETF6gHGq0RMT_FkRkvOU04mklKq1KbQrPg34R9z6O8dVGgRRSm2qEdBMLYSdvocbQxMfNzndR2PCOO0KXxDbjLPARRbA9FTj3JU-3kWSnNTzYeSD5UAugj9XjbwO7z1ywrZ4zaSFwXViGkU-oUGnPkMjXQFzjlsY-gBWZQTcRPS9I_jI6jbqm_YusU14FA5GoO2NYYKO6f8SPh3gJ5SRqA47_dQekwPIFxdP9mHXdJk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB-p3SSiNmUpiAWuResPCX-z6GG8IG78WlU0ZajzcNVcIgTK1Drul4j9CTO-PHmj8D44flO3qLM1yGCh2mHStnbYT8ZVVknXEd7Vjo09uQJ38N6sSJshBaw3GyMszMOCk-s7FBQOWEPQsZzcE_UY5ghA4HwZIhZxjsCIbOk2Dc-Iqqb0dXj-qJq4eDEJEHSw03sTFZ42CVdiUk0pUbIaX_UQCQmhBqhOjlZW38QADD7HYJe5n4iXIZQIZ7RLCzvhYByWRg40Wsmq_k",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 md:px-10 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">BookVerse</h2>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Home
              </Link>
              <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Explore
              </Link>
              <Link className="text-sm font-bold text-primary" href="#">
                My Books
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-lg border border-input bg-background px-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search"
              />
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIMrJPoKWjtK5ua0-KkqWQn-ZlwzYP4r9o8ZI65al99SShITvwRFAZevVQLY7QyRIU2pyx4g0K2Dff62ZdKjUW7WXSi8Y6LCj0clCy_qrUQF4MavpCzXmJlY8MmZGVriDmm9HhYkom19gdwNEirixSfG7ore-Ev-N9RZkPZcQX8HP2blOauhQwJ4IFpqljPNKP44TRpXoBURBZlNRGoVThuKkmhEhe6lPVDttum5vneTVu9SYBzScrkbo5WEQQP04-Pmc_YeoXCvI" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-10 lg:px-20 xl:px-40 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-6 text-center mb-10">
            <Avatar className="h-32 w-32">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwfGM3yqi0WDftnsJkRxp5C8oVP5IWP-vbbUasETXQqk0oRwUInnohGX_sUuMljjRVevBRebvz5MKIRCQBqhw2W-7TyLZO5FdXLGUiOT7I14D_7Ro6zdbSB7KBxf7LxgLk1bpTVrNLhlo1pTc365IyZiIM1Le8cCVOMeCRRkN7V6tQy1Xnw7x6cFytBZS99zJvaLy_P8R6IyQuj36zGJvb_hjW5KcKyzsgSUs_Fkl9Fk40XOP0271QBT7z0znL6CKvMhK6YoBbfy8" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-3xl font-bold">Sophia Bennett</h1>
              <p className="text-muted-foreground">Avid reader and book reviewer</p>
              <p className="text-sm text-muted-foreground">Joined in 2021</p>
            </div>
            <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              Edit Profile
            </Button>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="bookshelf" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="bookshelf">Bookshelf</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="bookshelf" className="space-y-8">
              {/* Bookshelf Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Bookshelf</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {bookCovers.map((cover, index) => (
                    <div key={index} className="aspect-[3/4] rounded-lg overflow-hidden">
                      <img
                        src={cover || "/placeholder.svg"}
                        alt={`Book cover ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Reading Stats */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Reading Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium text-muted-foreground">Total Books Read</p>
                        <p className="text-4xl font-bold">52</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium text-muted-foreground">Favorite Genre</p>
                        <p className="text-4xl font-bold">Fiction</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium text-muted-foreground">Average Rating</p>
                        <p className="text-4xl font-bold">4.5</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reviews yet. Start reading and share your thoughts!</p>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-2xl font-bold">Detailed Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Reading Progress This Year</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Books Read</span>
                        <span>52 / 60</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Top Genres</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Fiction</span>
                        <span className="text-sm font-medium">28 books</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mystery</span>
                        <span className="text-sm font-medium">12 books</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Biography</span>
                        <span className="text-sm font-medium">8 books</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
