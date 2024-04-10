const Listing=require("../models/listing.js");
/*const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});*/

module.exports.index = async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.search=async(req,res)=>{
    let city=req.query.listing.city;
    const allListing=await Listing.find({"$or":[{location:city},{country:city}]});
    res.render("listings/index.ejs",{allListing});
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next)=>{
    // let response=await geocodingClient.forwardGeocode({
    //     query:req.body.listing.location,
    //     limit:1,
    // }).send();
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(req.body);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={filename,url};
    //newListing.geometery=response.body.features[0].geometery;
    //console.log(newListing.geometery);
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req,res)=>{

    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data");
    }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={filename,url};
        await listing.save();
    }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}
